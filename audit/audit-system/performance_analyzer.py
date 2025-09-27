"""Performance analysis implementation with Core Web Vitals tracking."""

import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from .playwright_mcp_client import PlaywrightMCPClient, MCPResponse
from .models.audit_results import ValidationResult, PerformanceMetrics
from .models.performance_metrics import (
    PerformanceProfile,
    PerformanceMeasurement,
    MetricType,
    CoreWebVitalsThresholds
)
from .config.settings import get_cached_settings

logger = logging.getLogger(__name__)


class PerformanceAnalyzer:
    """Analyzes page performance and Core Web Vitals metrics."""

    def __init__(self, playwright_client: PlaywrightMCPClient):
        """Initialize performance analyzer.

        Args:
            playwright_client: Connected Playwright MCP client
        """
        self.client = playwright_client
        self.settings = get_cached_settings()
        self.thresholds = CoreWebVitalsThresholds.get_thresholds()

    async def analyze_performance(
        self,
        component_url: str,
        viewport_size: str,
        include_detailed_metrics: bool = True
    ) -> PerformanceProfile:
        """Analyze comprehensive performance metrics for a component.

        Args:
            component_url: URL of the component to analyze
            viewport_size: Viewport size description (e.g., "1920x1080")
            include_detailed_metrics: Whether to collect detailed performance metrics

        Returns:
            PerformanceProfile with all collected metrics
        """
        logger.info(f"Starting performance analysis for {component_url} at {viewport_size}")

        profile = PerformanceProfile(
            component_name=component_url.split('/')[-1] or "root",
            viewport_size=viewport_size,
            url=component_url
        )

        try:
            # Ensure page is loaded and stable
            await self.client.wait_for_load_state("networkidle")
            await asyncio.sleep(2)  # Additional stabilization time

            # Collect Core Web Vitals
            await self._collect_core_web_vitals(profile)

            # Collect additional performance metrics if requested
            if include_detailed_metrics:
                await self._collect_detailed_metrics(profile)

            # Calculate overall performance score
            profile.overall_score = profile.calculate_overall_score()

            logger.info(f"Performance analysis completed. Overall score: {profile.overall_score:.1f}")

        except Exception as e:
            logger.error(f"Performance analysis failed: {e}")
            # Add error measurement
            profile.add_measurement(
                MetricType.TTFB,
                9999,  # High value to indicate failure
                "ms",
                {"error": str(e)}
            )

        return profile

    async def _collect_core_web_vitals(self, profile: PerformanceProfile) -> None:
        """Collect Core Web Vitals metrics (LCP, FID, CLS, TTFB, FCP).

        Args:
            profile: PerformanceProfile to add measurements to
        """
        logger.debug("Collecting Core Web Vitals")

        # Use comprehensive JavaScript to get all available performance metrics
        core_vitals_script = """
        async function getCoreWebVitals() {
            const metrics = {};

            // Get Navigation Timing metrics
            const navEntry = performance.getEntriesByType('navigation')[0];
            if (navEntry) {
                // Time to First Byte
                metrics.ttfb = navEntry.responseStart - navEntry.requestStart;

                // DOM Content Loaded
                metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;

                // Load Complete
                metrics.loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
            }

            // Get Paint Timing metrics
            const paintEntries = performance.getEntriesByType('paint');
            for (const entry of paintEntries) {
                if (entry.name === 'first-contentful-paint') {
                    metrics.fcp = entry.startTime;
                } else if (entry.name === 'first-paint') {
                    metrics.fp = entry.startTime;
                }
            }

            // Try to get Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                        metrics.lcp = entries[entries.length - 1].startTime;
                    }
                });
                lcpObserver.observe({entryTypes: ['largest-contentful-paint']});

                // Give it a moment to collect LCP
                await new Promise(resolve => setTimeout(resolve, 100));
                lcpObserver.disconnect();
            } catch (e) {
                console.warn('LCP not available:', e);
            }

            // Try to get Cumulative Layout Shift
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    let clsScore = 0;
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    }
                    metrics.cls = clsScore;
                });
                clsObserver.observe({entryTypes: ['layout-shift']});

                // Give it a moment to collect CLS
                await new Promise(resolve => setTimeout(resolve, 100));
                clsObserver.disconnect();
            } catch (e) {
                console.warn('CLS not available:', e);
            }

            // Resource timing summary
            const resourceEntries = performance.getEntriesByType('resource');
            metrics.resourceCount = resourceEntries.length;

            // Calculate total resource load time
            let totalResourceTime = 0;
            for (const resource of resourceEntries) {
                totalResourceTime += resource.responseEnd - resource.fetchStart;
            }
            metrics.averageResourceLoadTime = resourceEntries.length > 0 ? totalResourceTime / resourceEntries.length : 0;

            return metrics;
        }

        return await getCoreWebVitals();
        """

        try:
            response = await self.client.evaluate_javascript(core_vitals_script)

            if response.success and response.content:
                # Extract metrics from response
                content = response.content[0]
                if content.get("type") == "text":
                    try:
                        import json
                        metrics_data = json.loads(content.get("text", "{}"))

                        # Add each metric to the profile
                        self._add_metric_if_valid(profile, MetricType.TTFB, metrics_data.get("ttfb"), "ms")
                        self._add_metric_if_valid(profile, MetricType.FCP, metrics_data.get("fcp"), "ms")
                        self._add_metric_if_valid(profile, MetricType.LCP, metrics_data.get("lcp"), "ms")
                        self._add_metric_if_valid(profile, MetricType.CLS, metrics_data.get("cls"), "score")

                        # Additional metrics
                        if "domContentLoaded" in metrics_data:
                            profile.add_measurement(
                                MetricType.SPEED_INDEX,  # Using as proxy for DOM load
                                metrics_data["domContentLoaded"],
                                "ms",
                                {"metric": "domContentLoaded"}
                            )

                        logger.debug(f"Collected Core Web Vitals: {len(profile.measurements)} metrics")

                    except json.JSONDecodeError as e:
                        logger.warning(f"Failed to parse Core Web Vitals response: {e}")

        except Exception as e:
            logger.error(f"Failed to collect Core Web Vitals: {e}")

    async def _collect_detailed_metrics(self, profile: PerformanceProfile) -> None:
        """Collect additional detailed performance metrics.

        Args:
            profile: PerformanceProfile to add measurements to
        """
        logger.debug("Collecting detailed performance metrics")

        detailed_script = """
        function getDetailedMetrics() {
            const metrics = {};

            // Memory usage (if available)
            if (performance.memory) {
                metrics.memoryUsed = performance.memory.usedJSHeapSize;
                metrics.memoryLimit = performance.memory.jsHeapSizeLimit;
                metrics.memoryTotal = performance.memory.totalJSHeapSize;
            }

            // Connection information
            if (navigator.connection) {
                metrics.connectionType = navigator.connection.effectiveType;
                metrics.downlink = navigator.connection.downlink;
                metrics.rtt = navigator.connection.rtt;
            }

            // Frame rate estimation
            let frameCount = 0;
            const startTime = performance.now();

            function countFrames() {
                frameCount++;
                if (performance.now() - startTime < 1000) {
                    requestAnimationFrame(countFrames);
                } else {
                    metrics.estimatedFPS = frameCount;
                }
            }

            // Start frame counting
            requestAnimationFrame(countFrames);

            // Resource breakdown
            const resources = performance.getEntriesByType('resource');
            const resourceTypes = {};

            for (const resource of resources) {
                const type = resource.initiatorType || 'other';
                if (!resourceTypes[type]) {
                    resourceTypes[type] = {count: 0, totalSize: 0, totalTime: 0};
                }
                resourceTypes[type].count++;
                resourceTypes[type].totalTime += resource.responseEnd - resource.fetchStart;
                if (resource.transferSize) {
                    resourceTypes[type].totalSize += resource.transferSize;
                }
            }

            metrics.resourceBreakdown = resourceTypes;

            // Page size estimation
            let totalTransferSize = 0;
            for (const resource of resources) {
                if (resource.transferSize) {
                    totalTransferSize += resource.transferSize;
                }
            }
            metrics.totalPageSize = totalTransferSize;

            // DOM complexity
            metrics.domElements = document.querySelectorAll('*').length;
            metrics.imageCount = document.querySelectorAll('img').length;
            metrics.scriptCount = document.querySelectorAll('script').length;
            metrics.stylesheetCount = document.querySelectorAll('link[rel="stylesheet"]').length;

            return metrics;
        }

        return getDetailedMetrics();
        """

        try:
            response = await self.client.evaluate_javascript(detailed_script)

            if response.success and response.content:
                content = response.content[0]
                if content.get("type") == "text":
                    try:
                        import json
                        metrics_data = json.loads(content.get("text", "{}"))

                        # Add detailed metrics with context
                        if "totalPageSize" in metrics_data:
                            profile.add_measurement(
                                MetricType.TBT,  # Using as proxy for page size
                                metrics_data["totalPageSize"] / 1024,  # Convert to KB
                                "KB",
                                {"metric": "totalPageSize"}
                            )

                        # Store additional context in measurement metadata
                        if "domElements" in metrics_data:
                            context = {
                                "domElements": metrics_data.get("domElements"),
                                "imageCount": metrics_data.get("imageCount"),
                                "scriptCount": metrics_data.get("scriptCount"),
                                "stylesheetCount": metrics_data.get("stylesheetCount")
                            }

                            # Add DOM complexity as a pseudo-metric
                            profile.add_measurement(
                                MetricType.SPEED_INDEX,
                                metrics_data["domElements"],
                                "elements",
                                context
                            )

                        logger.debug("Collected detailed performance metrics")

                    except json.JSONDecodeError as e:
                        logger.warning(f"Failed to parse detailed metrics response: {e}")

        except Exception as e:
            logger.error(f"Failed to collect detailed metrics: {e}")

    def _add_metric_if_valid(
        self,
        profile: PerformanceProfile,
        metric_type: MetricType,
        value: Optional[float],
        unit: str
    ) -> None:
        """Add a metric to the profile if the value is valid.

        Args:
            profile: PerformanceProfile to add measurement to
            metric_type: Type of metric
            value: Metric value (may be None)
            unit: Unit of measurement
        """
        if value is not None and value >= 0:
            profile.add_measurement(metric_type, value, unit)

    async def create_performance_validation_results(
        self,
        profile: PerformanceProfile
    ) -> List[ValidationResult]:
        """Create validation results from performance profile.

        Args:
            profile: PerformanceProfile with collected metrics

        Returns:
            List of ValidationResult objects for each metric
        """
        results = []

        # Validate each Core Web Vital against thresholds
        core_vitals = profile.get_core_web_vitals()

        for vital_name, measurement in core_vitals.items():
            if measurement:
                evaluation = measurement.evaluate_performance()
                threshold = self.thresholds.get(measurement.metric_type)

                if threshold:
                    status = evaluation in ["excellent", "good"]
                    message = f"{vital_name.upper()}: {measurement.value}{measurement.unit} ({evaluation})"

                    if not status:
                        if measurement.metric_type == MetricType.LCP:
                            message += f" - Target: <{threshold.good_max}ms"
                        elif measurement.metric_type == MetricType.FID:
                            message += f" - Target: <{threshold.good_max}ms"
                        elif measurement.metric_type == MetricType.CLS:
                            message += f" - Target: <{threshold.good_max}"

                    results.append(ValidationResult(
                        test_name=f"core_web_vitals_{vital_name}_{profile.viewport_size}",
                        status=status,
                        message=message,
                        duration_ms=100  # Approximate measurement time
                    ))

        # Overall performance score validation
        overall_score = profile.overall_score or profile.calculate_overall_score()
        performance_grade = profile.get_performance_grade()

        results.append(ValidationResult(
            test_name=f"overall_performance_{profile.viewport_size}",
            status=overall_score >= 75,  # Good performance threshold
            message=f"Overall performance score: {overall_score:.1f}/100 (Grade: {performance_grade})",
            duration_ms=200
        ))

        return results

    async def generate_performance_recommendations(
        self,
        profile: PerformanceProfile
    ) -> List[str]:
        """Generate performance improvement recommendations.

        Args:
            profile: PerformanceProfile to analyze

        Returns:
            List of actionable recommendations
        """
        recommendations = []

        core_vitals = profile.get_core_web_vitals()

        # LCP recommendations
        lcp_measurement = core_vitals.get('lcp')
        if lcp_measurement and lcp_measurement.value > 2500:
            recommendations.extend([
                "Optimize Largest Contentful Paint by reducing server response times",
                "Preload critical resources and optimize image loading",
                "Consider using CDN for faster content delivery"
            ])

        # FID recommendations
        fid_measurement = core_vitals.get('fid')
        if fid_measurement and fid_measurement.value > 100:
            recommendations.extend([
                "Reduce First Input Delay by optimizing JavaScript execution",
                "Break up long-running tasks into smaller chunks",
                "Use web workers for heavy computations"
            ])

        # CLS recommendations
        cls_measurement = core_vitals.get('cls')
        if cls_measurement and cls_measurement.value > 0.1:
            recommendations.extend([
                "Fix Cumulative Layout Shift by setting image dimensions",
                "Reserve space for dynamic content",
                "Avoid inserting content above existing content"
            ])

        # TTFB recommendations
        for measurement in profile.measurements:
            if measurement.metric_type == MetricType.TTFB and measurement.value > 800:
                recommendations.extend([
                    "Optimize server response time (TTFB)",
                    "Use server-side caching",
                    "Optimize database queries"
                ])
                break

        # General recommendations based on overall score
        overall_score = profile.overall_score or profile.calculate_overall_score()
        if overall_score < 50:
            recommendations.extend([
                "Consider implementing a performance budget",
                "Audit and optimize third-party scripts",
                "Enable compression (gzip/brotli) for text resources"
            ])

        return recommendations[:5]  # Limit to top 5 recommendations

    def create_performance_metrics_model(self, profile: PerformanceProfile) -> PerformanceMetrics:
        """Convert PerformanceProfile to PerformanceMetrics model.

        Args:
            profile: PerformanceProfile to convert

        Returns:
            PerformanceMetrics model instance
        """
        # Extract specific metrics from measurements
        ttfb_ms = None
        fcp_ms = None
        lcp_ms = None
        cls_score = None
        fid_ms = None

        for measurement in profile.measurements:
            if measurement.metric_type == MetricType.TTFB:
                ttfb_ms = measurement.value
            elif measurement.metric_type == MetricType.FCP:
                fcp_ms = measurement.value
            elif measurement.metric_type == MetricType.LCP:
                lcp_ms = measurement.value
            elif measurement.metric_type == MetricType.CLS:
                cls_score = measurement.value
            elif measurement.metric_type == MetricType.FID:
                fid_ms = measurement.value

        return PerformanceMetrics(
            ttfb_ms=ttfb_ms,
            fcp_ms=fcp_ms,
            lcp_ms=lcp_ms,
            cls_score=cls_score,
            fid_ms=fid_ms,
            viewport_size=profile.viewport_size
        )