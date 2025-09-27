"""Audit target configurations and component definitions."""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from ..models.component_status import ComponentValidationPlan, ComponentTestCase


class AuditTarget(BaseModel):
    """Definition of a component or feature to be audited."""

    name: str = Field(..., description="Component name")
    url_path: str = Field(..., description="URL path relative to base URL")
    claimed_percentage: int = Field(..., description="Claimed completion percentage")
    description: str = Field(..., description="Description of the component")
    priority: str = Field(default="medium", description="Priority level: high, medium, low")
    test_categories: List[str] = Field(
        default=["responsive", "performance", "accessibility"],
        description="Categories of tests to run"
    )
    custom_validation_criteria: Dict[str, List[str]] = Field(
        default_factory=dict,
        description="Custom validation criteria per test category"
    )


class AuditTargetRegistry:
    """Registry of predefined audit targets for common components."""

    @staticmethod
    def get_default_targets() -> List[AuditTarget]:
        """Get default set of audit targets for typical web applications."""
        return [
            AuditTarget(
                name="Primary Navigation",
                url_path="/",
                claimed_percentage=96,
                description="Main navigation menu and user interface",
                priority="high",
                test_categories=["responsive", "accessibility"],
                custom_validation_criteria={
                    "responsive": [
                        "Navigation collapses to hamburger menu on mobile",
                        "All menu items remain accessible at all breakpoints",
                        "Dropdown menus work correctly on touch devices",
                        "Logo and branding elements scale appropriately"
                    ],
                    "accessibility": [
                        "Navigation is keyboard accessible",
                        "Screen reader can navigate menu structure",
                        "Focus indicators are clearly visible",
                        "ARIA attributes are properly implemented"
                    ]
                }
            ),
            AuditTarget(
                name="Home Page Layout",
                url_path="/",
                claimed_percentage=90,
                description="Main landing page layout and content presentation",
                priority="high",
                test_categories=["responsive", "performance", "accessibility"],
                custom_validation_criteria={
                    "responsive": [
                        "Hero section adapts to different screen sizes",
                        "Content sections stack appropriately on mobile",
                        "Images scale and maintain aspect ratios",
                        "Call-to-action buttons remain prominent"
                    ],
                    "performance": [
                        "Images are optimized and compressed",
                        "Critical CSS is inlined",
                        "Non-critical resources are deferred",
                        "Font loading is optimized"
                    ]
                }
            ),
            AuditTarget(
                name="Search Functionality",
                url_path="/search",
                claimed_percentage=85,
                description="Search interface and results display",
                priority="medium",
                test_categories=["responsive", "accessibility"],
                custom_validation_criteria={
                    "responsive": [
                        "Search bar maintains usable size on mobile",
                        "Search results are readable at all breakpoints",
                        "Filters and sorting options work on touch devices",
                        "Pagination controls are touch-friendly"
                    ],
                    "accessibility": [
                        "Search form has proper labels",
                        "Results are announced to screen readers",
                        "Search suggestions are keyboard navigable",
                        "Error messages are clearly communicated"
                    ]
                }
            ),
            AuditTarget(
                name="User Dashboard",
                url_path="/dashboard",
                claimed_percentage=75,
                description="User account dashboard and personal information",
                priority="medium",
                test_categories=["responsive", "performance"],
                custom_validation_criteria={
                    "responsive": [
                        "Dashboard widgets stack appropriately on mobile",
                        "Data tables are scrollable horizontally if needed",
                        "Action buttons remain accessible",
                        "Charts and graphs scale properly"
                    ],
                    "performance": [
                        "Dashboard data loads progressively",
                        "Large datasets are paginated or virtualized",
                        "Real-time updates don't block UI",
                        "Charts render efficiently"
                    ]
                }
            ),
            AuditTarget(
                name="Form Interactions",
                url_path="/contact",
                claimed_percentage=80,
                description="Contact forms and user input handling",
                priority="high",
                test_categories=["responsive", "accessibility"],
                custom_validation_criteria={
                    "responsive": [
                        "Form fields are easily tappable on mobile",
                        "Input validation messages are visible",
                        "Submit buttons remain accessible",
                        "Multi-step forms work on small screens"
                    ],
                    "accessibility": [
                        "All form fields have proper labels",
                        "Validation errors are announced",
                        "Required fields are clearly marked",
                        "Form can be completed using only keyboard"
                    ]
                }
            )
        ]

    @staticmethod
    def create_validation_plan(target: AuditTarget, base_url: str) -> ComponentValidationPlan:
        """Create a validation plan from an audit target."""
        plan = ComponentValidationPlan(
            component_name=target.name,
            component_url=f"{base_url.rstrip('/')}{target.url_path}",
            claimed_percentage=target.claimed_percentage,
            validation_strategy="comprehensive"
        )

        # Add test cases based on categories
        if "responsive" in target.test_categories:
            # Use default breakpoints - will be updated by the validator
            plan.add_responsive_tests([
                {"width": 1920, "height": 1080},
                {"width": 375, "height": 667}
            ])

        if "performance" in target.test_categories:
            plan.add_performance_tests()

        if "accessibility" in target.test_categories:
            plan.add_accessibility_tests()

        # Add custom validation criteria if specified
        if target.custom_validation_criteria:
            for test_case in plan.test_cases:
                criteria = target.custom_validation_criteria.get(test_case.test_type, [])
                if criteria:
                    test_case.validation_criteria.extend(criteria)

        return plan

    @staticmethod
    def get_target_by_name(name: str) -> Optional[AuditTarget]:
        """Get a specific audit target by name."""
        targets = AuditTargetRegistry.get_default_targets()
        for target in targets:
            if target.name.lower() == name.lower():
                return target
        return None

    @staticmethod
    def get_high_priority_targets() -> List[AuditTarget]:
        """Get only high-priority audit targets."""
        targets = AuditTargetRegistry.get_default_targets()
        return [t for t in targets if t.priority == "high"]

    @staticmethod
    def filter_targets_by_categories(categories: List[str]) -> List[AuditTarget]:
        """Filter targets that include specific test categories."""
        targets = AuditTargetRegistry.get_default_targets()
        return [
            t for t in targets
            if any(cat in t.test_categories for cat in categories)
        ]


def create_custom_target(
    name: str,
    url_path: str,
    claimed_percentage: int,
    description: str = "",
    priority: str = "medium",
    test_categories: Optional[List[str]] = None
) -> AuditTarget:
    """Create a custom audit target."""
    if test_categories is None:
        test_categories = ["responsive", "performance", "accessibility"]

    return AuditTarget(
        name=name,
        url_path=url_path,
        claimed_percentage=claimed_percentage,
        description=description or f"Custom audit target for {name}",
        priority=priority,
        test_categories=test_categories
    )