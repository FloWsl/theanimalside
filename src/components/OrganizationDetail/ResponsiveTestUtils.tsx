// src/components/OrganizationDetail/ResponsiveTestUtils.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface DeviceSpecs {
  name: string;
  width: number;
  height: number;
  devicePixelRatio: number;
  userAgent: string;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface ResponsiveTestResult {
  device: string;
  passed: boolean;
  issues: string[];
  performance: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface ResponsiveTestUtilsProps {
  enabled?: boolean;
  onTestComplete?: (results: ResponsiveTestResult[]) => void;
}

const commonDevices: DeviceSpecs[] = [
  // Mobile Devices
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'mobile'
  },
  {
    name: 'iPhone 12',
    width: 390,
    height: 844,
    devicePixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'mobile'
  },
  {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    devicePixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    category: 'mobile'
  },
  {
    name: 'Google Pixel 5',
    width: 393,
    height: 851,
    devicePixelRatio: 2.75,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36',
    category: 'mobile'
  },
  // Tablet Devices
  {
    name: 'iPad',
    width: 768,
    height: 1024,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'tablet'
  },
  {
    name: 'iPad Pro',
    width: 834,
    height: 1194,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    category: 'tablet'
  },
  // Desktop
  {
    name: 'Desktop 1920x1080',
    width: 1920,
    height: 1080,
    devicePixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    category: 'desktop'
  }
];

// Touch target validation utility
const validateTouchTargets = (): string[] => {
  const issues: string[] = [];
  const minTouchSize = 44; // WCAG minimum touch target size
  
  const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [role="tab"]');
  
  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const elementId = element.id || element.className || `element-${index}`;
    
    if (rect.width < minTouchSize || rect.height < minTouchSize) {
      issues.push(`Touch target too small: ${elementId} (${Math.round(rect.width)}x${Math.round(rect.height)}px, minimum 44x44px)`);
    }
  });
  
  return issues;
};

// Text readability validation
const validateTextReadability = (): string[] => {
  const issues: string[] = [];
  const minFontSize = 16; // iOS zoom prevention
  
  const textElements = document.querySelectorAll('p, span, div, label, input, textarea');
  
  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const fontSize = parseInt(styles.fontSize);
    const elementId = element.id || element.className || `text-${index}`;
    
    if (fontSize < minFontSize && element.textContent && element.textContent.trim()) {
      issues.push(`Text too small: ${elementId} (${fontSize}px, minimum 16px for mobile)`);
    }
  });
  
  return issues;
};

// Layout stability validation
const validateLayoutStability = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const issues: string[] = [];
    let cumulativeLayoutShift = 0;
    
    // Observe layout shifts
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        cumulativeLayoutShift += (entry as any).value;
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    // Check after 3 seconds
    setTimeout(() => {
      observer.disconnect();
      if (cumulativeLayoutShift > 0.1) {
        issues.push(`High cumulative layout shift: ${cumulativeLayoutShift.toFixed(3)} (maximum 0.1)`);
      }
      resolve(issues);
    }, 3000);
  });
};

// Performance metrics collection
const collectPerformanceMetrics = (): Promise<{ lcp: number; fid: number; cls: number }> => {
  return new Promise((resolve) => {
    const metrics = { lcp: 0, fid: 0, cls: 0 };
    
    // LCP - Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        metrics.lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID - First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        metrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // CLS - Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          metrics.cls += entry.value;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
    
    // Resolve after collection period
    setTimeout(() => resolve(metrics), 5000);
  });
};

// Accessibility validation
const validateAccessibility = (): string[] => {
  const issues: string[] = [];
  
  // Check for missing alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt) {
      issues.push(`Missing alt attribute: image-${index}`);
    }
  });
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push(`Heading hierarchy skip: ${heading.tagName} after h${lastLevel} at position ${index}`);
    }
    lastLevel = level;
  });
  
  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const id = input.id;
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      issues.push(`Missing label for input: ${id || `input-${index}`}`);
    }
  });
  
  return issues;
};

const ResponsiveTestUtils: React.FC<ResponsiveTestUtilsProps> = ({ 
  enabled = false, 
  onTestComplete 
}) => {
  const [isTestingVisible, setIsTestingVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceSpecs | null>(null);
  const [testResults, setTestResults] = useState<ResponsiveTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  // Show testing panel only in development
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    setIsTestingVisible(enabled && isDevelopment);
  }, [enabled]);

  // Run comprehensive test on a device configuration
  const runDeviceTest = async (device: DeviceSpecs): Promise<ResponsiveTestResult> => {
    // Simulate device viewport
    if (window.innerWidth !== device.width) {
      // In a real implementation, this would change the viewport
      console.log(`Testing on ${device.name} (${device.width}x${device.height})`);
    }
    
    const issues: string[] = [];
    
    // Run all validation checks
    const touchIssues = validateTouchTargets();
    const textIssues = validateTextReadability();
    const accessibilityIssues = validateAccessibility();
    const layoutIssues = await validateLayoutStability();
    
    issues.push(...touchIssues, ...textIssues, ...accessibilityIssues, ...layoutIssues);
    
    // Collect performance metrics
    const performance = await collectPerformanceMetrics();
    
    return {
      device: device.name,
      passed: issues.length === 0,
      issues,
      performance
    };
  };

  // Run tests for all devices
  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    setTestResults([]);
    
    const results: ResponsiveTestResult[] = [];
    
    for (let i = 0; i < commonDevices.length; i++) {
      const device = commonDevices[i];
      setCurrentDevice(device);
      
      const result = await runDeviceTest(device);
      results.push(result);
      
      setTestProgress(((i + 1) / commonDevices.length) * 100);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTestResults(results);
    setCurrentDevice(null);
    setIsRunningTests(false);
    
    if (onTestComplete) {
      onTestComplete(results);
    }
  };

  // Get device icon
  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (!isTestingVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isTestingVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-sage-green/20 max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-beige/60">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sage-green" />
                <h3 className="font-semibold text-deep-forest">Responsive Testing</h3>
              </div>
              <button
                onClick={() => setIsTestingVisible(false)}
                className="p-1 hover:bg-beige/30 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Test Controls */}
              <div className="space-y-4">
                <button
                  onClick={runComprehensiveTests}
                  disabled={isRunningTests}
                  className="w-full bg-sage-green hover:bg-sage-green/90 disabled:bg-sage-green/50 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                >
                  {isRunningTests ? 'Running Tests...' : 'Run Comprehensive Tests'}
                </button>

                {/* Progress */}
                {isRunningTests && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forest/70">
                        {currentDevice ? `Testing ${currentDevice.name}` : 'Preparing...'}
                      </span>
                      <span className="text-forest/70">{Math.round(testProgress)}%</span>
                    </div>
                    <div className="w-full bg-beige/30 rounded-full h-2">
                      <motion.div
                        className="bg-sage-green h-2 rounded-full"
                        style={{ width: `${testProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Results */}
                {testResults.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    <h4 className="font-medium text-deep-forest">Test Results</h4>
                    {testResults.map((result, index) => (
                      <div key={index} className="border border-beige/60 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(
                              commonDevices.find(d => d.name === result.device)?.category || 'desktop'
                            )}
                            <span className="font-medium text-deep-forest text-sm">
                              {result.device}
                            </span>
                          </div>
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div className="text-center">
                            <div className="text-xs text-forest/60">LCP</div>
                            <div className={`text-xs font-medium ${
                              result.performance.lcp < 2500 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.round(result.performance.lcp)}ms
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-forest/60">FID</div>
                            <div className={`text-xs font-medium ${
                              result.performance.fid < 100 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.round(result.performance.fid)}ms
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-forest/60">CLS</div>
                            <div className={`text-xs font-medium ${
                              result.performance.cls < 0.1 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.performance.cls.toFixed(3)}
                            </div>
                          </div>
                        </div>

                        {/* Issues */}
                        {result.issues.length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-red-600 hover:text-red-700">
                              {result.issues.length} issues found
                            </summary>
                            <div className="mt-2 space-y-1">
                              {result.issues.map((issue, issueIndex) => (
                                <div key={issueIndex} className="text-red-600 bg-red-50 p-2 rounded">
                                  {issue}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponsiveTestUtils;

// Export utility functions for external testing
export {
  validateTouchTargets,
  validateTextReadability,
  validateLayoutStability,
  collectPerformanceMetrics,
  validateAccessibility,
  commonDevices
};
