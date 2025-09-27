"""Core audit data structures using Pydantic models."""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ComponentStatus(str, Enum):
    """Status levels for component validation."""
    PRODUCTION_READY = "production_ready"
    NEAR_COMPLETE = "near_complete"
    IN_DEVELOPMENT = "in_development"
    NOT_STARTED = "not_started"
    BROKEN = "broken"


class ValidationResult(BaseModel):
    """Result of a single validation test."""
    test_name: str = Field(..., description="Name of the validation test")
    status: bool = Field(..., description="Whether the test passed")
    message: str = Field(..., description="Detailed test result message")
    evidence: Optional[str] = Field(None, description="Evidence/screenshot data")
    duration_ms: int = Field(..., description="Test execution time in milliseconds")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ComponentAuditResult(BaseModel):
    """Complete audit result for a single component."""
    component_name: str = Field(..., description="Name of the component being audited")
    claimed_percentage: int = Field(..., description="Originally claimed completion percentage")
    evidenced_percentage: int = Field(..., description="Evidence-based completion percentage")
    status: ComponentStatus = Field(..., description="Current component status")
    validation_results: List[ValidationResult] = Field(default_factory=list)
    gap_analysis: str = Field(..., description="Analysis of gaps between claims and reality")
    priority: str = Field(..., description="Priority level for addressing gaps")

    class Config:
        use_enum_values = True


class PerformanceMetrics(BaseModel):
    """Performance measurement results."""
    ttfb_ms: Optional[float] = Field(None, description="Time to First Byte in milliseconds")
    fcp_ms: Optional[float] = Field(None, description="First Contentful Paint in milliseconds")
    lcp_ms: Optional[float] = Field(None, description="Largest Contentful Paint in milliseconds")
    cls_score: Optional[float] = Field(None, description="Cumulative Layout Shift score")
    fid_ms: Optional[float] = Field(None, description="First Input Delay in milliseconds")
    viewport_size: str = Field(..., description="Viewport size during measurement")

    def get_performance_grade(self) -> str:
        """Calculate performance grade based on Core Web Vitals."""
        if not self.lcp_ms or not self.cls_score:
            return "UNKNOWN"

        # Core Web Vitals thresholds
        lcp_good = self.lcp_ms <= 2500
        cls_good = self.cls_score <= 0.1
        fid_good = not self.fid_ms or self.fid_ms <= 100

        good_metrics = sum([lcp_good, cls_good, fid_good])

        if good_metrics == 3:
            return "EXCELLENT"
        elif good_metrics == 2:
            return "GOOD"
        elif good_metrics == 1:
            return "NEEDS_IMPROVEMENT"
        else:
            return "POOR"


class AuditSession(BaseModel):
    """Complete audit session results."""
    session_id: str = Field(..., description="Unique audit session identifier")
    started_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = Field(None)
    total_components: int = Field(..., description="Total number of components audited")
    components_passed: int = Field(0, description="Number of components that passed validation")
    overall_frontend_percentage: int = Field(..., description="Overall frontend completion percentage")
    overall_backend_percentage: int = Field(..., description="Overall backend completion percentage")
    component_results: List[ComponentAuditResult] = Field(default_factory=list)
    performance_results: List[PerformanceMetrics] = Field(default_factory=list)
    critical_gaps: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

    @property
    def duration_minutes(self) -> Optional[float]:
        """Calculate audit duration in minutes."""
        if not self.completed_at:
            return None

        duration = self.completed_at - self.started_at
        return duration.total_seconds() / 60

    @property
    def success_rate(self) -> float:
        """Calculate percentage of components that passed validation."""
        if self.total_components == 0:
            return 0.0

        return (self.components_passed / self.total_components) * 100

    def add_component_result(self, result: ComponentAuditResult) -> None:
        """Add a component audit result and update counters."""
        self.component_results.append(result)
        self.total_components = len(self.component_results)

        # Count components that passed (production ready or near complete)
        self.components_passed = sum(
            1 for r in self.component_results
            if r.status in [ComponentStatus.PRODUCTION_READY, ComponentStatus.NEAR_COMPLETE]
        )

    def calculate_overall_percentages(self) -> None:
        """Calculate overall completion percentages based on component results."""
        if not self.component_results:
            self.overall_frontend_percentage = 0
            self.overall_backend_percentage = 0
            return

        # Frontend percentage is average of evidenced percentages
        total_evidenced = sum(r.evidenced_percentage for r in self.component_results)
        self.overall_frontend_percentage = int(total_evidenced / len(self.component_results))

        # Backend percentage estimate (could be enhanced with actual backend validation)
        # For now, assume backend is proportional to frontend but typically lower
        self.overall_backend_percentage = max(0, self.overall_frontend_percentage - 15)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }