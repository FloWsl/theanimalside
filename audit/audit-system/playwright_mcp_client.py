"""Playwright MCP client integration with connection management and browser automation."""

import asyncio
import httpx
import json
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class MCPRequest(BaseModel):
    """MCP request structure."""
    tool: str
    arguments: Dict[str, Any]


class MCPResponse(BaseModel):
    """MCP response structure."""
    success: bool
    content: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None
    duration_ms: Optional[int] = None


class PlaywrightMCPClient:
    """Client for interacting with Playwright MCP server."""

    def __init__(self, mcp_endpoint: str, timeout: int = 30):
        """Initialize the Playwright MCP client.

        Args:
            mcp_endpoint: URL of the Playwright MCP server
            timeout: Timeout in seconds for MCP operations
        """
        self.mcp_endpoint = mcp_endpoint.rstrip('/')
        self.timeout = timeout
        self.session: Optional[httpx.AsyncClient] = None
        self.is_connected = False

    async def connect(self) -> bool:
        """Connect to the Playwright MCP server.

        Returns:
            True if connection successful, False otherwise
        """
        try:
            self.session = httpx.AsyncClient(timeout=self.timeout)

            # Test connection with a simple health check
            response = await self._call_mcp_tool("ping", {})

            if response.success:
                self.is_connected = True
                logger.info(f"Successfully connected to Playwright MCP server at {self.mcp_endpoint}")
                return True
            else:
                logger.error(f"Failed to connect to MCP server: {response.error}")
                return False

        except Exception as e:
            logger.error(f"Connection failed: {e}")
            self.is_connected = False
            return False

    async def disconnect(self) -> None:
        """Disconnect from the Playwright MCP server."""
        if self.session:
            await self.session.aclose()
            self.session = None
        self.is_connected = False
        logger.info("Disconnected from Playwright MCP server")

    async def _call_mcp_tool(self, tool: str, arguments: Dict[str, Any]) -> MCPResponse:
        """Call an MCP tool and return structured response.

        Args:
            tool: Name of the MCP tool to call
            arguments: Arguments to pass to the tool

        Returns:
            MCPResponse with success status and content/error
        """
        if not self.session:
            return MCPResponse(success=False, error="Not connected to MCP server")

        start_time = datetime.now()

        try:
            request_data = {
                "tool": tool,
                "arguments": arguments
            }

            response = await self.session.post(
                f"{self.mcp_endpoint}/mcp",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )

            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            if response.status_code == 200:
                response_data = response.json()
                return MCPResponse(
                    success=True,
                    content=response_data.get("content", []),
                    duration_ms=duration_ms
                )
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                return MCPResponse(
                    success=False,
                    error=error_msg,
                    duration_ms=duration_ms
                )

        except httpx.TimeoutException:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return MCPResponse(
                success=False,
                error=f"Request timed out after {self.timeout} seconds",
                duration_ms=duration_ms
            )
        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            return MCPResponse(
                success=False,
                error=f"Unexpected error: {str(e)}",
                duration_ms=duration_ms
            )

    async def navigate(self, url: str) -> MCPResponse:
        """Navigate to a URL.

        Args:
            url: URL to navigate to

        Returns:
            MCPResponse with navigation result
        """
        logger.debug(f"Navigating to: {url}")
        return await self._call_mcp_tool("navigate", {"url": url})

    async def set_viewport(self, width: int, height: int) -> MCPResponse:
        """Set viewport size for responsive testing.

        Args:
            width: Viewport width in pixels
            height: Viewport height in pixels

        Returns:
            MCPResponse with viewport setting result
        """
        logger.debug(f"Setting viewport to {width}x{height}")
        return await self._call_mcp_tool("setViewport", {
            "width": width,
            "height": height
        })

    async def wait_for_load_state(self, state: str = "networkidle") -> MCPResponse:
        """Wait for page to reach specific load state.

        Args:
            state: Load state to wait for (load, domcontentloaded, networkidle)

        Returns:
            MCPResponse with wait result
        """
        logger.debug(f"Waiting for load state: {state}")
        return await self._call_mcp_tool("waitForLoadState", {"state": state})

    async def screenshot(self, full_page: bool = False) -> MCPResponse:
        """Take a screenshot of the current page.

        Args:
            full_page: Whether to capture full page or just viewport

        Returns:
            MCPResponse with screenshot data
        """
        logger.debug("Taking screenshot")
        return await self._call_mcp_tool("screenshot", {"fullPage": full_page})

    async def evaluate_javascript(self, script: str) -> MCPResponse:
        """Execute JavaScript in the browser context.

        Args:
            script: JavaScript code to execute

        Returns:
            MCPResponse with execution result
        """
        logger.debug(f"Evaluating JavaScript: {script[:100]}...")
        return await self._call_mcp_tool("evaluateJavaScript", {"script": script})

    async def click_element(self, selector: str) -> MCPResponse:
        """Click an element by selector.

        Args:
            selector: CSS selector for the element to click

        Returns:
            MCPResponse with click result
        """
        logger.debug(f"Clicking element: {selector}")
        return await self._call_mcp_tool("click", {"selector": selector})

    async def get_accessibility_snapshot(self) -> MCPResponse:
        """Get accessibility tree snapshot.

        Returns:
            MCPResponse with accessibility data
        """
        logger.debug("Getting accessibility snapshot")
        return await self._call_mcp_tool("getAccessibilitySnapshot", {})

    async def measure_performance(self) -> MCPResponse:
        """Measure page performance metrics.

        Returns:
            MCPResponse with performance data
        """
        logger.debug("Measuring performance")

        # Use JavaScript to get Core Web Vitals
        performance_script = """
        async function getCoreWebVitals() {
            const paintEntries = performance.getEntriesByType('paint');
            const navigationEntry = performance.getEntriesByType('navigation')[0];

            // Get FCP
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            const fcp = fcpEntry ? fcpEntry.startTime : null;

            // Get TTFB
            const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : null;

            return {
                fcp: fcp,
                ttfb: ttfb,
                loadTime: navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : null,
                domContentLoaded: navigationEntry ? navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart : null
            };
        }

        return await getCoreWebVitals();
        """

        return await self.evaluate_javascript(performance_script)

    async def check_responsive_elements(self, breakpoint: Dict[str, int]) -> MCPResponse:
        """Check for responsive design issues at a specific breakpoint.

        Args:
            breakpoint: Dictionary with width and height

        Returns:
            MCPResponse with responsive analysis
        """
        # Set viewport first
        viewport_response = await self.set_viewport(breakpoint["width"], breakpoint["height"])
        if not viewport_response.success:
            return viewport_response

        # Wait for any layout changes
        await asyncio.sleep(1)

        # Check for common responsive issues
        responsive_check_script = f"""
        function checkResponsiveIssues() {{
            const issues = [];
            const viewportWidth = {breakpoint["width"]};
            const viewportHeight = {breakpoint["height"]};

            // Check for horizontal scrolling
            if (document.body.scrollWidth > window.innerWidth) {{
                issues.push("Horizontal scrolling detected");
            }}

            // Check for elements extending beyond viewport
            const allElements = document.querySelectorAll('*');
            for (let element of allElements) {{
                const rect = element.getBoundingClientRect();
                if (rect.right > window.innerWidth + 10) {{ // 10px tolerance
                    issues.push(`Element extends beyond viewport: ${{element.tagName}}.${{element.className}}`);
                    break; // Only report first occurrence
                }}
            }}

            // Check for touch targets on mobile
            if (viewportWidth <= 768) {{
                const clickableElements = document.querySelectorAll('button, a, input, select, textarea');
                for (let element of clickableElements) {{
                    const rect = element.getBoundingClientRect();
                    const minSize = 44; // Recommended minimum touch target size
                    if (rect.width < minSize || rect.height < minSize) {{
                        issues.push(`Touch target too small: ${{element.tagName}} (${{Math.round(rect.width)}}x${{Math.round(rect.height)}}px)`);
                    }}
                }}
            }}

            return {{
                viewportSize: `${{viewportWidth}}x${{viewportHeight}}`,
                issues: issues,
                hasIssues: issues.length > 0
            }};
        }}

        return checkResponsiveIssues();
        """

        return await self.evaluate_javascript(responsive_check_script)

    async def validate_accessibility(self) -> MCPResponse:
        """Validate basic accessibility requirements.

        Returns:
            MCPResponse with accessibility validation results
        """
        accessibility_script = """
        function validateAccessibility() {
            const issues = [];

            // Check for images without alt text
            const images = document.querySelectorAll('img');
            for (let img of images) {
                if (!img.alt && !img.getAttribute('aria-label')) {
                    issues.push(`Image without alt text: ${img.src || 'unknown source'}`);
                }
            }

            // Check for form inputs without labels
            const inputs = document.querySelectorAll('input, textarea, select');
            for (let input of inputs) {
                const hasLabel = input.labels && input.labels.length > 0;
                const hasAriaLabel = input.getAttribute('aria-label');
                const hasAriaLabelledBy = input.getAttribute('aria-labelledby');

                if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
                    issues.push(`Form input without label: ${input.type || input.tagName}`);
                }
            }

            // Check for sufficient color contrast (basic check)
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
            let contrastIssues = 0;

            for (let element of textElements) {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;

                // Simple heuristic: if text is very light on light background or dark on dark
                if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
                    contrastIssues++;
                }
            }

            if (contrastIssues > 0) {
                issues.push(`Potential color contrast issues detected: ${contrastIssues} elements`);
            }

            // Check for keyboard navigation support
            const focusableElements = document.querySelectorAll(
                'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            );

            return {
                totalIssues: issues.length,
                issues: issues,
                imageCount: images.length,
                formInputCount: inputs.length,
                focusableElementCount: focusableElements.length,
                isAccessible: issues.length === 0
            };
        }

        return validateAccessibility();
        """

        return await self.evaluate_javascript(accessibility_script)

    async def __aenter__(self):
        """Async context manager entry."""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.disconnect()