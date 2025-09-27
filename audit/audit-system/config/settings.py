"""Settings and configuration management for the audit system."""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Dict, Any
from pathlib import Path
from dotenv import load_dotenv
import os


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    # Playwright MCP Configuration
    playwright_mcp_endpoint: str = Field(
        default="http://localhost:3001",
        description="Playwright MCP server endpoint"
    )
    mcp_timeout_seconds: int = Field(
        default=30,
        description="Timeout for MCP operations in seconds"
    )

    # Audit Configuration
    base_url: str = Field(
        default="http://localhost:3000",
        description="Base URL of the application to audit"
    )
    audit_report_dir: Path = Field(
        default=Path("./audit_reports"),
        description="Directory for audit reports"
    )
    screenshot_dir: Path = Field(
        default=Path("./audit_reports/screenshots"),
        description="Directory for screenshots"
    )

    # Performance Thresholds
    max_lcp_ms: int = Field(
        default=2500,
        description="Maximum LCP in milliseconds for good performance"
    )
    max_fid_ms: int = Field(
        default=100,
        description="Maximum FID in milliseconds for good performance"
    )
    max_cls_score: float = Field(
        default=0.1,
        description="Maximum CLS score for good performance"
    )

    # Audit System Settings
    log_level: str = Field(
        default="INFO",
        description="Logging level"
    )
    parallel_tests: int = Field(
        default=3,
        description="Number of parallel test executions"
    )
    retry_attempts: int = Field(
        default=2,
        description="Number of retry attempts for failed tests"
    )

    # Responsive Testing Configuration
    desktop_breakpoints: List[Dict[str, int]] = Field(
        default=[
            {"width": 1920, "height": 1080},
            {"width": 1366, "height": 768},
            {"width": 1024, "height": 768}
        ],
        description="Desktop viewport sizes for responsive testing"
    )

    mobile_breakpoints: List[Dict[str, int]] = Field(
        default=[
            {"width": 375, "height": 667},  # iPhone SE
            {"width": 414, "height": 896},  # iPhone 11 Pro Max
            {"width": 360, "height": 740}   # Android typical
        ],
        description="Mobile viewport sizes for responsive testing"
    )

    # Component Test Targets
    default_components: List[str] = Field(
        default=[
            "Primary Navigation",
            "Home Page",
            "Search Functionality",
            "User Dashboard",
            "Form Interactions"
        ],
        description="Default components to audit if none specified"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

    def ensure_directories(self) -> None:
        """Ensure all required directories exist."""
        self.audit_report_dir.mkdir(parents=True, exist_ok=True)
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def get_all_breakpoints(self) -> List[Dict[str, int]]:
        """Get combined list of all breakpoints for testing."""
        return self.desktop_breakpoints + self.mobile_breakpoints

    def get_performance_thresholds(self) -> Dict[str, Any]:
        """Get performance thresholds as dictionary."""
        return {
            "lcp_ms": self.max_lcp_ms,
            "fid_ms": self.max_fid_ms,
            "cls_score": self.max_cls_score
        }


def get_settings() -> Settings:
    """Get cached settings instance with proper environment loading."""
    # Load environment variables from .env file
    load_dotenv()

    try:
        settings = Settings()
        settings.ensure_directories()
        return settings
    except Exception as e:
        error_msg = f"Failed to load settings: {e}"
        if "playwright_mcp_endpoint" in str(e).lower():
            error_msg += "\nMake sure PLAYWRIGHT_MCP_ENDPOINT is configured in your .env file"
        raise ValueError(error_msg) from e


# Cache settings instance
_settings_instance = None


def get_cached_settings() -> Settings:
    """Get cached settings instance."""
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = get_settings()
    return _settings_instance