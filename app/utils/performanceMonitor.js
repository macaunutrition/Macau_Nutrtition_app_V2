import { PerformanceObserver, performance } from 'perf_hooks';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      imageLoads: [],
      lottieRenders: [],
      memoryUsage: [],
      renderTimes: [],
    };
    
    this.isEnabled = __DEV__; // Only enable in development
  }

  // Track image loading performance
  trackImageLoad(url, startTime, endTime, success = true) {
    if (!this.isEnabled) return;
    
    const loadTime = endTime - startTime;
    this.metrics.imageLoads.push({
      url,
      loadTime,
      success,
      timestamp: Date.now(),
    });

    // Log slow image loads
    if (loadTime > 3000) { // 3 seconds
      console.warn(`Slow image load: ${url} took ${loadTime}ms`);
    }

    // Keep only last 100 entries
    if (this.metrics.imageLoads.length > 100) {
      this.metrics.imageLoads = this.metrics.imageLoads.slice(-100);
    }
  }

  // Track Lottie animation performance
  trackLottieRender(animationName, renderTime) {
    if (!this.isEnabled) return;
    
    this.metrics.lottieRenders.push({
      animationName,
      renderTime,
      timestamp: Date.now(),
    });

    // Log slow renders
    if (renderTime > 100) { // 100ms
      console.warn(`Slow Lottie render: ${animationName} took ${renderTime}ms`);
    }

    // Keep only last 50 entries
    if (this.metrics.lottieRenders.length > 50) {
      this.metrics.lottieRenders = this.metrics.lottieRenders.slice(-50);
    }
  }

  // Track memory usage
  trackMemoryUsage() {
    if (!this.isEnabled) return;
    
    // This is a simplified memory tracking
    // In a real app, you might use native modules for accurate memory info
    const memoryInfo = {
      timestamp: Date.now(),
      jsHeapSizeUsed: performance.memory?.usedJSHeapSize || 0,
      jsHeapSizeTotal: performance.memory?.totalJSHeapSize || 0,
    };

    this.metrics.memoryUsage.push(memoryInfo);

    // Keep only last 50 entries
    if (this.metrics.memoryUsage.length > 50) {
      this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-50);
    }
  }

  // Get performance summary
  getSummary() {
    if (!this.isEnabled) return null;

    const imageStats = this.calculateImageStats();
    const lottieStats = this.calculateLottieStats();
    const memoryStats = this.calculateMemoryStats();

    return {
      images: imageStats,
      lottie: lottieStats,
      memory: memoryStats,
      timestamp: Date.now(),
    };
  }

  calculateImageStats() {
    const loads = this.metrics.imageLoads;
    if (loads.length === 0) return null;

    const successful = loads.filter(load => load.success);
    const failed = loads.filter(load => !load.success);
    const loadTimes = successful.map(load => load.loadTime);

    return {
      totalLoads: loads.length,
      successfulLoads: successful.length,
      failedLoads: failed.length,
      successRate: (successful.length / loads.length * 100).toFixed(1) + '%',
      averageLoadTime: loadTimes.length > 0 ? 
        (loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length).toFixed(0) + 'ms' : 'N/A',
      slowLoads: loadTimes.filter(time => time > 3000).length,
    };
  }

  calculateLottieStats() {
    const renders = this.metrics.lottieRenders;
    if (renders.length === 0) return null;

    const renderTimes = renders.map(render => render.renderTime);

    return {
      totalRenders: renders.length,
      averageRenderTime: renderTimes.length > 0 ? 
        (renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length).toFixed(0) + 'ms' : 'N/A',
      slowRenders: renderTimes.filter(time => time > 100).length,
    };
  }

  calculateMemoryStats() {
    const usage = this.metrics.memoryUsage;
    if (usage.length === 0) return null;

    const latest = usage[usage.length - 1];
    const earliest = usage[0];

    return {
      currentUsage: this.formatBytes(latest.jsHeapSizeUsed),
      totalHeap: this.formatBytes(latest.jsHeapSizeTotal),
      memoryGrowth: usage.length > 1 ? 
        this.formatBytes(latest.jsHeapSizeUsed - earliest.jsHeapSizeUsed) : '0 B',
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Log performance summary to console
  logSummary() {
    if (!this.isEnabled) return;
    
    const summary = this.getSummary();
    if (summary) {
      console.log('🚀 Performance Summary:', summary);
    }
  }

  // Clear all metrics
  clear() {
    this.metrics = {
      imageLoads: [],
      lottieRenders: [],
      memoryUsage: [],
      renderTimes: [],
    };
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Hook for React components
export const usePerformanceMonitor = () => {
  const trackImageLoad = React.useCallback((url, startTime, endTime, success) => {
    performanceMonitor.trackImageLoad(url, startTime, endTime, success);
  }, []);

  const trackLottieRender = React.useCallback((animationName, renderTime) => {
    performanceMonitor.trackLottieRender(animationName, renderTime);
  }, []);

  const getSummary = React.useCallback(() => {
    return performanceMonitor.getSummary();
  }, []);

  return {
    trackImageLoad,
    trackLottieRender,
    getSummary,
  };
};

