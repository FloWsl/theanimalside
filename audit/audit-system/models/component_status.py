"""Component validation status models."""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from .audit_results import ComponentStatus, ValidationResult


class ComponentTestCase(BaseModel):
    """Definition of a test case for component validation."""
    test_id: str = Field(..., description="Unique identifier for the test case")
    test_name: str = Field(..., description="Human-readable test name")
    test_description: str = Field(..., description="Description of what the test validates")
    test_type: str = Field(..., description="Type of test (responsive, performance, accessibility)")
    breakpoint: Optional[str] = Field(None, description="Breakpoint for responsive tests")
    expected_behavior: str = Field(..., description="Expected behavior description")
    validation_criteria: List[str] = Field(default_factory=list, description="Specific validation criteria")


class ComponentValidationPlan(BaseModel):
    """Validation plan for a component with all test cases."""
    component_name: str = Field(..., description="Name of the component to validate")
    component_url: str = Field(..., description="URL where component can be tested")
    claimed_percentage: int = Field(..., description="Claimed completion percentage")
    test_cases: List[ComponentTestCase] = Field(default_factory=list)
    validation_strategy: str = Field(default="comprehensive", description="Validation strategy")

    def add_responsive_tests(self, breakpoints: List[Dict[str, int]]) -> None:
        """Add responsive validation test cases for each breakpoint."""
        for bp in breakpoints:
            test_case = ComponentTestCase(
                test_id=f"responsive_{bp['width']}x{bp['height']}",
                test_name=f"Responsive at {bp['width']}x{bp['height']}",
                test_description=f"Validate component behavior at {bp['width']}x{bp['height']} viewport",
                test_type="responsive",
                breakpoint=f"{bp['width']}x{bp['height']}",
                expected_behavior="Component should adapt layout and remain functional",
                validation_criteria=[
                    "Navigation elements are accessible",
                    "Content is readable",
                    "Interactive elements work correctly",
                    "No horizontal scrolling",
                    "No layout overflow"
                ]
            )
            self.test_cases.append(test_case)

    def add_performance_tests(self) -> None:
        """Add performance validation test cases."""
        test_case = ComponentTestCase(
            test_id="performance_core_web_vitals",
            test_name="Core Web Vitals Performance",
            test_description="Measure and validate Core Web Vitals metrics",
            test_type="performance",
            expected_behavior="All Core Web Vitals should meet acceptable thresholds",
            validation_criteria=[
                "LCP < 2.5 seconds",
                "FID < 100 milliseconds",
                "CLS < 0.1",
                "TTFB < 800 milliseconds"
            ]
        )
        self.test_cases.append(test_case)

    def add_accessibility_tests(self) -> None:
        """Add accessibility validation test cases."""
        test_case = ComponentTestCase(
            test_id="accessibility_wcag_aa",
            test_name="WCAG AA Compliance",
            test_description="Validate WCAG AA accessibility compliance",
            test_type="accessibility",
            expected_behavior="Component should meet WCAG AA standards",
            validation_criteria=[
                "Color contrast ratio >= 4.5:1",
                "All images have alt text",
                "Interactive elements are keyboard accessible",
                "Focus indicators are visible",
                "Screen reader compatible",
                "Touch targets >= 44x44 pixels"
            ]
        )
        self.test_cases.append(test_case)


class ComponentExecutionResult(BaseModel):
    """Results from executing validation tests for a component."""
    validation_plan: ComponentValidationPlan
    execution_started_at: datetime = Field(default_factory=datetime.now)
    execution_completed_at: Optional[datetime] = Field(None)
    validation_results: List[ValidationResult] = Field(default_factory=list)
    overall_status: ComponentStatus = Field(default=ComponentStatus.NOT_STARTED)
    execution_errors: List[str] = Field(default_factory=list)

    @property
    def execution_duration_ms(self) -> Optional[int]:
        """Calculate execution duration in milliseconds."""
        if not self.execution_completed_at:
            return None

        duration = self.execution_completed_at - self.execution_started_at
        return int(duration.total_seconds() * 1000)

    @property
    def success_rate(self) -> float:
        """Calculate percentage of tests that passed."""
        if not self.validation_results:
            return 0.0

        passed = sum(1 for r in self.validation_results if r.status)
        return (passed / len(self.validation_results)) * 100

    def determine_component_status(self) -> ComponentStatus:
        """Determine component status based on validation results."""
        if not self.validation_results:
            return ComponentStatus.NOT_STARTED

        success_rate = self.success_rate

        if success_rate >= 95:
            return ComponentStatus.PRODUCTION_READY
        elif success_rate >= 85:
            return ComponentStatus.NEAR_COMPLETE
        elif success_rate >= 60:
            return ComponentStatus.IN_DEVELOPMENT
        elif success_rate > 0:
            return ComponentStatus.BROKEN
        else:
            return ComponentStatus.NOT_STARTED

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }