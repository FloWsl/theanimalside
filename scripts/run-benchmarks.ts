#!/usr/bin/env tsx

// 🏃‍♂️ Database Performance Benchmark Runner
// Automated performance testing for database operations

import { performanceMonitor } from '../src/utils/performance/databaseMetrics';
import { PerformanceAnalyzer } from '../src/services/organizationService.performance';

// Test configuration
const TEST_CONFIG = {
  organizationId: 'test-org-123',
  concurrency: 5,
  iterations: 3,
  timeout: 30000 // 30 seconds
};

interface BenchmarkResults {
  timestamp: string;
  environment: string;
  overallScore: number;
  tabPerformance: any;
  stressTest: any;
  memoryUsage: any;
  recommendations: string[];
}

class BenchmarkRunner {
  private results: BenchmarkResults[] = [];

  async runCompleteBenchmark(): Promise<BenchmarkResults> {
    console.log('🚀 Starting comprehensive database performance benchmark...\n');
    
    const startTime = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';
    
    try {
      // 1. Basic performance benchmarks
      console.log('📊 Running basic performance benchmarks...');
      const basicBenchmarks = await performanceMonitor.runBenchmarkTests();
      
      // 2. Tab performance analysis
      console.log('\n🗂️  Analyzing tab performance...');
      const tabPerformance = await PerformanceAnalyzer.analyzeTabPerformance(TEST_CONFIG.organizationId);
      
      // 3. Stress testing
      console.log('\n🏋️‍♂️  Running stress tests...');
      const stressTest = await PerformanceAnalyzer.stressTest(TEST_CONFIG.organizationId, TEST_CONFIG.concurrency);
      
      // 4. Memory analysis
      console.log('\n🧠 Analyzing memory usage...');
      const memoryUsage = PerformanceAnalyzer.analyzeMemoryUsage();
      
      // Compile recommendations
      const recommendations = [
        ...tabPerformance.recommendations,
        ...stressTest.recommendations,
        ...memoryUsage.recommendations
      ].filter((rec, index, arr) => arr.indexOf(rec) === index); // Remove duplicates

      const results: BenchmarkResults = {
        timestamp: startTime,
        environment,
        overallScore: basicBenchmarks.overallScore,
        tabPerformance,
        stressTest,
        memoryUsage,
        recommendations
      };

      this.results.push(results);
      
      // Print summary
      this.printBenchmarkSummary(results);
      
      // Save results
      await this.saveResults(results);
      
      return results;
      
    } catch (error) {
      console.error('❌ Benchmark failed:', error.message);
      throw error;
    }
  }

  private printBenchmarkSummary(results: BenchmarkResults): void {
    console.log('\n📋 BENCHMARK SUMMARY');
    console.log('==========================================');
    console.log(`Environment: ${results.environment}`);
    console.log(`Timestamp: ${results.timestamp}`);
    console.log(`Overall Score: ${results.overallScore}%`);
    
    // Performance grades
    const grade = this.getPerformanceGrade(results.overallScore);
    const gradeEmoji = this.getGradeEmoji(grade);
    console.log(`Performance Grade: ${gradeEmoji} ${grade}`);
    
    console.log('\n📊 Tab Performance:');
    console.log(`  Overview: ${results.tabPerformance.overview.toFixed(0)}ms`);
    console.log(`  Experience: ${results.tabPerformance.experience.toFixed(0)}ms`);
    console.log(`  Practical: ${results.tabPerformance.practical.toFixed(0)}ms`);
    console.log(`  Location: ${results.tabPerformance.location.toFixed(0)}ms`);
    console.log(`  Stories: ${results.tabPerformance.stories.toFixed(0)}ms`);
    console.log(`  Essentials: ${results.tabPerformance.essentials.toFixed(0)}ms`);
    console.log(`  Total Time: ${results.tabPerformance.totalTime.toFixed(0)}ms`);
    
    console.log('\n🏋️‍♂️  Stress Test Results:');
    console.log(`  Average Response Time: ${results.stressTest.averageTime.toFixed(0)}ms`);
    console.log(`  Success Rate: ${results.stressTest.successRate.toFixed(1)}%`);
    console.log(`  Error Count: ${results.stressTest.errors.length}`);
    
    console.log('\n🧠 Memory Usage:');
    console.log(`  Current Usage: ${results.memoryUsage.currentUsage}MB`);
    console.log(`  Peak Usage: ${results.memoryUsage.peakUsage}MB`);
    
    if (results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    } else {
      console.log('\n✨ No performance issues detected!');
    }
    
    console.log('\n==========================================');
  }

  private getPerformanceGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  private getGradeEmoji(grade: string): string {
    switch (grade) {
      case 'A+': return '🏆';
      case 'A': return '🥇';
      case 'B': return '🥈';
      case 'C': return '🥉';
      case 'D': return '⚠️';
      default: return '❌';
    }
  }

  private async saveResults(results: BenchmarkResults): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Create benchmark results directory
    const resultsDir = path.join(process.cwd(), 'benchmark-results');
    try {
      await fs.mkdir(resultsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    
    // Save detailed results
    const filename = `benchmark-${results.timestamp.split('T')[0]}-${Date.now()}.json`;
    const filepath = path.join(resultsDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${filepath}`);
    
    // Save summary CSV for tracking over time
    const csvPath = path.join(resultsDir, 'benchmark-summary.csv');
    const csvRow = [
      results.timestamp,
      results.environment,
      results.overallScore,
      results.tabPerformance.totalTime.toFixed(0),
      results.stressTest.averageTime.toFixed(0),
      results.stressTest.successRate.toFixed(1),
      results.memoryUsage.currentUsage,
      results.recommendations.length
    ].join(',');
    
    // Check if CSV exists, create header if not
    try {
      await fs.access(csvPath);
    } catch {
      const csvHeader = 'timestamp,environment,overall_score,total_tab_time_ms,stress_avg_time_ms,stress_success_rate,memory_usage_mb,recommendation_count\n';
      await fs.writeFile(csvPath, csvHeader);
    }
    
    // Append results
    await fs.appendFile(csvPath, csvRow + '\n');
    console.log(`📈 Summary appended to: ${csvPath}`);
  }

  async compareWithPrevious(): Promise<void> {
    if (this.results.length < 2) {
      console.log('📊 No previous results for comparison');
      return;
    }

    const current = this.results[this.results.length - 1];
    const previous = this.results[this.results.length - 2];

    console.log('\n📈 PERFORMANCE COMPARISON');
    console.log('==========================================');
    
    const scoreDiff = current.overallScore - previous.overallScore;
    const scoreEmoji = scoreDiff > 0 ? '📈' : scoreDiff < 0 ? '📉' : '➡️';
    console.log(`Overall Score: ${previous.overallScore}% → ${current.overallScore}% ${scoreEmoji}`);
    
    const timeDiff = current.tabPerformance.totalTime - previous.tabPerformance.totalTime;
    const timeEmoji = timeDiff < 0 ? '⚡' : timeDiff > 0 ? '🐌' : '➡️';
    console.log(`Total Tab Time: ${previous.tabPerformance.totalTime.toFixed(0)}ms → ${current.tabPerformance.totalTime.toFixed(0)}ms ${timeEmoji}`);
    
    console.log('==========================================');
  }

  async runContinuousMonitoring(intervalMinutes: number = 30): Promise<void> {
    console.log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)`);
    console.log('Press Ctrl+C to stop\n');

    const interval = setInterval(async () => {
      try {
        console.log(`\n⏰ Running scheduled benchmark - ${new Date().toLocaleTimeString()}`);
        await this.runCompleteBenchmark();
        await this.compareWithPrevious();
      } catch (error) {
        console.error('❌ Scheduled benchmark failed:', error.message);
      }
    }, intervalMinutes * 60 * 1000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping continuous monitoring...');
      clearInterval(interval);
      process.exit(0);
    });

    // Run initial benchmark
    await this.runCompleteBenchmark();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const runner = new BenchmarkRunner();

  try {
    switch (command) {
      case 'run':
        await runner.runCompleteBenchmark();
        break;
      
      case 'monitor':
        const interval = parseInt(args[1]) || 30;
        await runner.runContinuousMonitoring(interval);
        break;
      
      case 'compare':
        // Run current and compare with previous
        await runner.runCompleteBenchmark();
        await runner.compareWithPrevious();
        break;
      
      default:
        console.log('🏃‍♂️ Database Performance Benchmark Runner\n');
        console.log('Usage:');
        console.log('  npm run benchmark              # Run single benchmark');
        console.log('  npx tsx scripts/run-benchmarks.ts run        # Run single benchmark');
        console.log('  npx tsx scripts/run-benchmarks.ts monitor    # Continuous monitoring (30min intervals)');
        console.log('  npx tsx scripts/run-benchmarks.ts monitor 15 # Continuous monitoring (15min intervals)');
        console.log('  npx tsx scripts/run-benchmarks.ts compare    # Run and compare with previous');
        console.log('\nBenchmark tests:');
        console.log('  - Database query performance');
        console.log('  - Tab loading times');
        console.log('  - Stress testing with concurrent operations');
        console.log('  - Memory usage analysis');
        console.log('  - Performance recommendations');
        
        // Run default benchmark
        await runner.runCompleteBenchmark();
        break;
    }
  } catch (error) {
    console.error('💥 Benchmark runner failed:', error.message);
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  main();
}

export { BenchmarkRunner };