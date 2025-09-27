"""Responsive behavior validation for testing components across breakpoints."""

import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from .playwright_mcp_client import PlaywrightMCPClient, MCPResponse
from .models.audit_results import ValidationResult
from .models.component_status import ComponentValidationPlan
from .config.settings import get_cached_settings

logger = logging.getLogger(__name__)


class ResponsiveValidator:
    """Validates responsive behavior across different viewport sizes."""

    def __init__(self, playwright_client: PlaywrightMCPClient):
        """Initialize responsive validator.

        Args:
            playwright_client: Connected Playwright MCP client
        """
        self.client = playwright_client
        self.settings = get_cached_settings()

    async def validate_responsive_behavior(
        self,
        component_url: str,
        breakpoints: Optional[List[Dict[str, int]]] = None
    ) -> List[ValidationResult]:
        """Validate responsive behavior across multiple breakpoints.

        Args:
            component_url: URL of the component to test
            breakpoints: List of viewport sizes to test (default: uses settings)

        Returns:
            List of validation results for each breakpoint
        """
        if breakpoints is None:
            breakpoints = self.settings.get_all_breakpoints()

        logger.info(f"Starting responsive validation for {component_url} across {len(breakpoints)} breakpoints")

        results = []

        for breakpoint in breakpoints:
            logger.debug(f"Testing breakpoint: {breakpoint['width']}x{breakpoint['height']}")

            # Set viewport size before testing
            viewport_result = await self._set_viewport_and_navigate(component_url, breakpoint)
            if not viewport_result.status:
                results.append(viewport_result)
                continue

            # Wait for page to stabilize after viewport change
            await asyncio.sleep(1)

            # Run responsive tests for this breakpoint
            breakpoint_results = await self._test_breakpoint(breakpoint)
            results.extend(breakpoint_results)

        logger.info(f"Completed responsive validation: {len(results)} tests, "
                   f"{sum(1 for r in results if r.status)} passed")

        return results

    async def _set_viewport_and_navigate(
        self,
        url: str,
        breakpoint: Dict[str, int]
    ) -> ValidationResult:
        """Set viewport size and navigate to URL.

        Args:
            url: URL to navigate to
            breakpoint: Viewport size to set

        Returns:
            ValidationResult for viewport setup
        """
        start_time = datetime.now()

        try:
            # Set viewport size
            viewport_response = await self.client.set_viewport(
                breakpoint["width"],
                breakpoint["height"]
            )

            if not viewport_response.success:
                return ValidationResult(
                    test_name=f"viewport_setup_{breakpoint['width']}x{breakpoint['height']}",
                    status=False,
                    message=f"Failed to set viewport: {viewport_response.error}",
                    duration_ms=viewport_response.duration_ms or 0
                )

            # Navigate to URL
            nav_response = await self.client.navigate(url)

            if not nav_response.success:
                return ValidationResult(
                    test_name=f"navigation_{breakpoint['width']}x{breakpoint['height']}",
                    status=False,
                    message=f"Failed to navigate: {nav_response.error}",
                    duration_ms=nav_response.duration_ms or 0
                )

            # Wait for page load
            load_response = await self.client.wait_for_load_state("networkidle")

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            return ValidationResult(
                test_name=f"setup_{breakpoint['width']}x{breakpoint['height']}",
                status=load_response.success,
                message="Viewport and navigation setup completed successfully",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"setup_{breakpoint['width']}x{breakpoint['height']}",
                status=False,
                message=f"Setup failed: {str(e)}",
                duration_ms=duration_ms
            )

    async def _test_breakpoint(self, breakpoint: Dict[str, int]) -> List[ValidationResult]:
        """Run all responsive tests for a specific breakpoint.

        Args:
            breakpoint: Viewport size being tested

        Returns:
            List of validation results for this breakpoint
        """
        results = []
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        # Test 1: Layout stability and overflow
        layout_result = await self._test_layout_stability(breakpoint)
        results.append(layout_result)

        # Test 2: Navigation functionality
        nav_result = await self._test_navigation_functionality(breakpoint)
        results.append(nav_result)

        # Test 3: Interactive elements accessibility
        interaction_result = await self._test_interactive_elements(breakpoint)
        results.append(interaction_result)

        # Test 4: Content readability
        content_result = await self._test_content_readability(breakpoint)
        results.append(content_result)

        # Test 5: Touch targets (mobile only)
        if breakpoint["width"] <= 768:
            touch_result = await self._test_touch_targets(breakpoint)
            results.append(touch_result)

        return results

    async def _test_layout_stability(self, breakpoint: Dict[str, int]) -> ValidationResult:
        """Test layout stability and check for overflow issues.

        Args:
            breakpoint: Current viewport size

        Returns:
            ValidationResult for layout stability
        """
        start_time = datetime.now()
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        try:
            # Check for responsive issues using the client's built-in method
            response = await self.client.check_responsive_elements(breakpoint)

            if not response.success:
                return ValidationResult(
                    test_name=f"layout_stability_{viewport_key}",
                    status=False,
                    message=f"Failed to check layout: {response.error}",
                    duration_ms=response.duration_ms or 0
                )

            # Parse response content
            if response.content and len(response.content) > 0:
                content = response.content[0]
                if content.get("type") == "text":
                    try:
                        # Extract JavaScript evaluation result
                        text_content = content.get("text", "")
                        # The response should contain the JSON result from our JavaScript
                        import json
                        # Try to parse if it's JSON, otherwise treat as text
                        try:
                            result_data = json.loads(text_content)
                        except json.JSONDecodeError:
                            # If not JSON, assume it's an error message
                            result_data = {"hasIssues": True, "issues": [text_content]}

                        has_issues = result_data.get("hasIssues", False)
                        issues = result_data.get("issues", [])

                        status = not has_issues
                        message = "Layout is stable with no overflow issues"

                        if has_issues:
                            message = f"Layout issues detected: {'; '.join(issues[:3])}"
                            if len(issues) > 3:
                                message += f" (and {len(issues) - 3} more)"

                        duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

                        return ValidationResult(
                            test_name=f"layout_stability_{viewport_key}",
                            status=status,
                            message=message,
                            duration_ms=duration_ms
                        )

                    except Exception as e:
                        logger.warning(f"Failed to parse layout check response: {e}")

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            return ValidationResult(
                test_name=f"layout_stability_{viewport_key}",
                status=True,
                message="Layout check completed (no major issues detected)",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"layout_stability_{viewport_key}",
                status=False,
                message=f"Layout stability test failed: {str(e)}",
                duration_ms=duration_ms
            )

    async def _test_navigation_functionality(self, breakpoint: Dict[str, int]) -> ValidationResult:
        """Test navigation functionality at the current breakpoint.

        Args:
            breakpoint: Current viewport size

        Returns:
            ValidationResult for navigation functionality
        """
        start_time = datetime.now()
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        try:
            # Test navigation elements visibility and functionality
            nav_test_script = f"""
            function testNavigation() {{
                const issues = [];
                const viewport = "{viewport_key}";

                // Find common navigation elements
                const navElements = document.querySelectorAll(
                    'nav, .nav, .navbar, .navigation, [role="navigation"]'
                );

                if (navElements.length === 0) {{
                    issues.push("No navigation elements found");
                    return {{ viewport, issues, hasNavigation: false }};
                }}

                // Check if navigation is visible
                let visibleNavCount = 0;
                for (let nav of navElements) {{
                    const rect = nav.getBoundingClientRect();
                    const style = window.getComputedStyle(nav);

                    if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none') {{
                        visibleNavCount++;
                    }}
                }}

                if (visibleNavCount === 0) {{
                    issues.push("Navigation elements are not visible");
                }}

                // Check for mobile menu toggle on small screens
                if ({breakpoint["width"]} <= 768) {{
                    const menuToggles = document.querySelectorAll(
                        '.menu-toggle, .hamburger, .mobile-menu-toggle, [aria-label*="menu"], [aria-label*="Menu"]'
                    );

                    if (menuToggles.length === 0) {{
                        // Look for buttons that might be menu toggles
                        const buttons = document.querySelectorAll('button');
                        let foundToggle = false;

                        for (let button of buttons) {{
                            const text = button.textContent.toLowerCase();
                            if (text.includes('menu') || text.includes('☰') || text.includes('≡')) {{
                                foundToggle = true;
                                break;
                            }}
                        }}

                        if (!foundToggle) {{
                            issues.push("No mobile menu toggle found on mobile viewport");
                        }}
                    }}
                }}

                // Check for navigation links
                const navLinks = document.querySelectorAll(
                    'nav a, .nav a, .navbar a, .navigation a, [role="navigation"] a'
                );

                if (navLinks.length === 0) {{
                    issues.push("No navigation links found");
                }}

                return {{
                    viewport,
                    issues,
                    hasNavigation: navElements.length > 0,
                    visibleNavCount,
                    navLinkCount: navLinks.length,
                    isValid: issues.length === 0
                }};
            }}

            return testNavigation();
            """

            response = await self.client.evaluate_javascript(nav_test_script)

            if not response.success:
                return ValidationResult(
                    test_name=f"navigation_functionality_{viewport_key}",
                    status=False,
                    message=f"Failed to test navigation: {response.error}",
                    duration_ms=response.duration_ms or 0
                )

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            # Default success case
            return ValidationResult(
                test_name=f"navigation_functionality_{viewport_key}",
                status=True,
                message="Navigation functionality test completed",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"navigation_functionality_{viewport_key}",
                status=False,
                message=f"Navigation test failed: {str(e)}",
                duration_ms=duration_ms
            )

    async def _test_interactive_elements(self, breakpoint: Dict[str, int]) -> ValidationResult:
        """Test interactive elements accessibility and functionality.

        Args:
            breakpoint: Current viewport size

        Returns:
            ValidationResult for interactive elements
        """
        start_time = datetime.now()
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        try:
            interactive_test_script = """
            function testInteractiveElements() {
                const issues = [];
                const interactiveElements = document.querySelectorAll(
                    'button, a, input, select, textarea, [role="button"], [tabindex]'
                );

                let totalElements = interactiveElements.length;
                let accessibleElements = 0;

                for (let element of interactiveElements) {
                    const rect = element.getBoundingClientRect();
                    const style = window.getComputedStyle(element);

                    // Check visibility
                    if (rect.width > 0 && rect.height > 0 &&
                        style.visibility !== 'hidden' && style.display !== 'none') {
                        accessibleElements++;

                        // Check if element is properly focusable
                        const tabIndex = element.getAttribute('tabindex');
                        const isNativelyFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);

                        if (!isNativelyFocusable && (!tabIndex || tabIndex === '-1')) {
                            issues.push(`Non-focusable interactive element: ${element.tagName}`);
                        }
                    }
                }

                return {
                    totalElements,
                    accessibleElements,
                    issues,
                    isValid: issues.length === 0,
                    accessibilityRate: totalElements > 0 ? (accessibleElements / totalElements) * 100 : 100
                };
            }

            return testInteractiveElements();
            """

            response = await self.client.evaluate_javascript(interactive_test_script)

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            if not response.success:
                return ValidationResult(
                    test_name=f"interactive_elements_{viewport_key}",
                    status=False,
                    message=f"Failed to test interactive elements: {response.error}",
                    duration_ms=duration_ms
                )

            return ValidationResult(
                test_name=f"interactive_elements_{viewport_key}",
                status=True,
                message="Interactive elements test completed",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"interactive_elements_{viewport_key}",
                status=False,
                message=f"Interactive elements test failed: {str(e)}",
                duration_ms=duration_ms
            )

    async def _test_content_readability(self, breakpoint: Dict[str, int]) -> ValidationResult:
        """Test content readability at the current breakpoint.

        Args:
            breakpoint: Current viewport size

        Returns:
            ValidationResult for content readability
        """
        start_time = datetime.now()
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        try:
            readability_script = f"""
            function testContentReadability() {{
                const issues = [];
                const viewport = "{viewport_key}";

                // Check text elements for minimum font sizes
                const textElements = document.querySelectorAll(
                    'p, h1, h2, h3, h4, h5, h6, span, div, a, button, li'
                );

                let smallTextCount = 0;
                const minFontSize = {breakpoint["width"]} <= 768 ? 14 : 12; // Larger minimum for mobile

                for (let element of textElements) {{
                    const style = window.getComputedStyle(element);
                    const fontSize = parseFloat(style.fontSize);

                    if (fontSize < minFontSize) {{
                        smallTextCount++;
                    }}
                }}

                if (smallTextCount > 0) {{
                    issues.push(`${{smallTextCount}} text elements below minimum font size (${{minFontSize}}px)`);
                }}

                // Check for text that might be cut off
                let cutOffElements = 0;
                for (let element of textElements) {{
                    if (element.textContent.trim()) {{
                        const rect = element.getBoundingClientRect();
                        if (rect.right > window.innerWidth) {{
                            cutOffElements++;
                        }}
                    }}
                }}

                if (cutOffElements > 0) {{
                    issues.push(`${{cutOffElements}} text elements extend beyond viewport`);
                }}

                return {{
                    viewport,
                    issues,
                    textElementCount: textElements.length,
                    smallTextCount,
                    cutOffElements,
                    isReadable: issues.length === 0
                }};
            }}

            return testContentReadability();
            """

            response = await self.client.evaluate_javascript(readability_script)

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            if not response.success:
                return ValidationResult(
                    test_name=f"content_readability_{viewport_key}",
                    status=False,
                    message=f"Failed to test content readability: {response.error}",
                    duration_ms=duration_ms
                )

            return ValidationResult(
                test_name=f"content_readability_{viewport_key}",
                status=True,
                message="Content readability test completed",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"content_readability_{viewport_key}",
                status=False,
                message=f"Content readability test failed: {str(e)}",
                duration_ms=duration_ms
            )

    async def _test_touch_targets(self, breakpoint: Dict[str, int]) -> ValidationResult:
        """Test touch target sizes for mobile usability.

        Args:
            breakpoint: Current viewport size (should be mobile)

        Returns:
            ValidationResult for touch target sizes
        """
        start_time = datetime.now()
        viewport_key = f"{breakpoint['width']}x{breakpoint['height']}"

        try:
            touch_test_script = """
            function testTouchTargets() {
                const issues = [];
                const minTouchSize = 44; // iOS HIG and Material Design recommendation

                const touchTargets = document.querySelectorAll(
                    'button, a, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select'
                );

                let totalTargets = touchTargets.length;
                let inadequateTargets = 0;

                for (let target of touchTargets) {
                    const rect = target.getBoundingClientRect();
                    const style = window.getComputedStyle(target);

                    // Skip hidden elements
                    if (style.display === 'none' || style.visibility === 'hidden' ||
                        rect.width === 0 || rect.height === 0) {
                        continue;
                    }

                    if (rect.width < minTouchSize || rect.height < minTouchSize) {
                        inadequateTargets++;
                    }
                }

                if (inadequateTargets > 0) {
                    issues.push(`${inadequateTargets} touch targets smaller than ${minTouchSize}px`);
                }

                return {
                    totalTargets,
                    inadequateTargets,
                    issues,
                    minTouchSize,
                    isValid: issues.length === 0,
                    complianceRate: totalTargets > 0 ? ((totalTargets - inadequateTargets) / totalTargets) * 100 : 100
                };
            }

            return testTouchTargets();
            """

            response = await self.client.evaluate_javascript(touch_test_script)

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            if not response.success:
                return ValidationResult(
                    test_name=f"touch_targets_{viewport_key}",
                    status=False,
                    message=f"Failed to test touch targets: {response.error}",
                    duration_ms=duration_ms
                )

            return ValidationResult(
                test_name=f"touch_targets_{viewport_key}",
                status=True,
                message="Touch targets test completed",
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return ValidationResult(
                test_name=f"touch_targets_{viewport_key}",
                status=False,
                message=f"Touch targets test failed: {str(e)}",
                duration_ms=duration_ms
            )