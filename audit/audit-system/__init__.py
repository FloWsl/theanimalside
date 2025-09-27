"""Implementation Audit System with Playwright MCP.

A comprehensive audit system that validates project completion claims through
automated testing, responsive behavior analysis, and performance measurement.
"""

__version__ = "1.0.0"
__author__ = "Audit System Team"
__email__ = "team@audit-system.com"

from .models.audit_results import (
    AuditSession,
    ComponentAuditResult,
    ComponentStatus,
    PerformanceMetrics,
    ValidationResult,
)

__all__ = [
    "AuditSession",
    "ComponentAuditResult",
    "ComponentStatus",
    "PerformanceMetrics",
    "ValidationResult",
]