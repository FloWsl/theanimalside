"""Performance measurement models and utilities."""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum


class MetricType(str, Enum):
    """Types of performance metrics."""
    TTFB = "ttfb"  # Time to First Byte
    FCP = "fcp"    # First Contentful Paint
    LCP = "lcp"    # Largest Contentful Paint
    CLS = "cls"    # Cumulative Layout Shift
    FID = "fid"    # First Input Delay
    TBT = "tbt"    # Total Blocking Time
    SPEED_INDEX = "speed_index"


class PerformanceThreshold(BaseModel):
    """Performance thresholds for different metric types."""
    metric_type: MetricType
    excellent_max: float = Field(..., description="Maximum value for excellent rating")
    good_max: float = Field(..., description="Maximum value for good rating")
    needs_improvement_max: float = Field(..., description="Maximum value for needs improvement")

    def evaluate_score(self, value: float) -> str:
        """Evaluate a metric value against thresholds."""
        if value <= self.excellent_max:
            return "excellent"
        elif value <= self.good_max:
            return "good"
        elif value <= self.needs_improvement_max:
            return "needs_improvement"
        else:
            return "poor"


class CoreWebVitalsThresholds:
    """Standard Core Web Vitals thresholds."""

    @staticmethod
    def get_thresholds() -> Dict[MetricType, PerformanceThreshold]:
        """Get standard Core Web Vitals thresholds."""
        return {
            MetricType.LCP: PerformanceThreshold(
                metric_type=MetricType.LCP,
                excellent_max=2500,  # milliseconds
                good_max=4000,
                needs_improvement_max=6000
            ),
            MetricType.FID: PerformanceThreshold(
                metric_type=MetricType.FID,
                excellent_max=100,   # milliseconds
                good_max=300,
                needs_improvement_max=500
            ),
            MetricType.CLS: PerformanceThreshold(
                metric_type=MetricType.CLS,
                excellent_max=0.1,   # score
                good_max=0.25,
                needs_improvement_max=0.5
            ),
            MetricType.TTFB: PerformanceThreshold(
                metric_type=MetricType.TTFB,
                excellent_max=800,   # milliseconds
                good_max=1800,
                needs_improvement_max=3000
            ),
            MetricType.FCP: PerformanceThreshold(
                metric_type=MetricType.FCP,
                excellent_max=1800,  # milliseconds
                good_max=3000,
                needs_improvement_max=5000
            )
        }


class PerformanceMeasurement(BaseModel):
    """Individual performance measurement."""
    metric_type: MetricType
    value: float = Field(..., description="Measured value")
    unit: str = Field(..., description="Unit of measurement (ms, score, etc.)")
    timestamp: datetime = Field(default_factory=datetime.now)
    measurement_context: Dict[str, Any] = Field(default_factory=dict)

    def evaluate_performance(self) -> str:
        """Evaluate this measurement against standard thresholds."""
        thresholds = CoreWebVitalsThresholds.get_thresholds()
        threshold = thresholds.get(self.metric_type)

        if not threshold:
            return "unknown"

        return threshold.evaluate_score(self.value)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PerformanceProfile(BaseModel):
    """Complete performance profile for a component at specific viewport."""
    component_name: str = Field(..., description="Name of component being measured")
    viewport_size: str = Field(..., description="Viewport size during measurement")
    url: str = Field(..., description="URL where measurement was taken")
    measurements: List[PerformanceMeasurement] = Field(default_factory=list)
    overall_score: Optional[float] = Field(None, description="Overall performance score 0-100")
    measurement_timestamp: datetime = Field(default_factory=datetime.now)

    def add_measurement(self, metric_type: MetricType, value: float, unit: str,
                       context: Optional[Dict[str, Any]] = None) -> None:
        """Add a performance measurement."""
        measurement = PerformanceMeasurement(
            metric_type=metric_type,
            value=value,
            unit=unit,
            measurement_context=context or {}
        )
        self.measurements.append(measurement)

    def get_core_web_vitals(self) -> Dict[str, Optional[PerformanceMeasurement]]:
        """Extract Core Web Vitals measurements."""
        core_vitals = {
            'lcp': None,
            'fid': None,
            'cls': None
        }

        for measurement in self.measurements:
            if measurement.metric_type == MetricType.LCP:
                core_vitals['lcp'] = measurement
            elif measurement.metric_type == MetricType.FID:
                core_vitals['fid'] = measurement
            elif measurement.metric_type == MetricType.CLS:
                core_vitals['cls'] = measurement

        return core_vitals

    def calculate_overall_score(self) -> float:
        """Calculate overall performance score based on all measurements."""
        if not self.measurements:
            return 0.0

        scores = []
        for measurement in self.measurements:
            evaluation = measurement.evaluate_performance()

            # Convert evaluation to numeric score
            score_map = {
                'excellent': 100,
                'good': 75,
                'needs_improvement': 50,
                'poor': 25,
                'unknown': 50
            }
            scores.append(score_map.get(evaluation, 50))

        return sum(scores) / len(scores) if scores else 0.0

    def get_performance_grade(self) -> str:
        """Get letter grade based on overall score."""
        score = self.overall_score or self.calculate_overall_score()

        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }