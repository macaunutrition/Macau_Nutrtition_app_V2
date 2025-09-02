import { InteractionManager, AppState } from 'react-native';
import { ImageOptimizer } from './ImageOptimizer';

// Performance optimization utilities
export class PerformanceOptimizer {
  static isInitialized = false;
  static performanceMetrics = {
    appStartTime: Date.now(),
    screenLoadTimes: new Map(),
    imageLoadTimes: new Map(),
    memoryWarnings: 0,
  };

  // Initialize performance monitoring
  static initialize = () => {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // Monitor app state changes
    AppState.addEventListener('change', this.handleAppStateChange);
    
    // Monitor memory warnings
    AppState.addEventListener('memoryWarning', this.handleMemoryWarning);
    
    console.log('Performance Optimizer initialized');
  };

  // Handle app state changes
  static handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      // App going to background - optimize memory
      this.optimizeForBackground();
    } else if (nextAppState === 'active') {
      // App coming to foreground - restore performance
      this.optimizeForForeground();
    }
  };

  // Handle memory warnings
  static handleMemoryWarning = () => {
    this.performanceMetrics.memoryWarnings++;
    console.warn('Memory warning received, optimizing...');
    
    // Clear image caches
    ImageOptimizer.clearCache();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  };

  // Optimize for background
  static optimizeForBackground = () => {
    console.log('Optimizing for background...');
    
    // Clear memory cache but keep disk cache
    ImageOptimizer.clearCache();
    
    // Pause non-essential operations
    this.pauseNonEssentialOperations();
  };

  // Optimize for foreground
  static optimizeForForeground = () => {
    console.log('Optimizing for foreground...');
    
    // Resume essential operations
    this.resumeEssentialOperations();
  };

  // Pause non-essential operations
  static pauseNonEssentialOperations = () => {
    // This would pause things like:
    // - Non-critical animations
    // - Background data fetching
    // - Analytics batching
  };

  // Resume essential operations
  static resumeEssentialOperations = () => {
    // This would resume things like:
    // - Critical animations
    // - User-facing data fetching
    // - Real-time updates
  };

  // Run after interactions complete
  static runAfterInteractions = (callback) => {
    InteractionManager.runAfterInteractions(callback);
  };

  // Defer heavy operations
  static deferHeavyOperation = (operation, delay = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          const result = operation();
          resolve(result);
        });
      }, delay);
    });
  };

  // Batch operations for better performance
  static batchOperations = (operations, batchSize = 5) => {
    const batches = [];
    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize));
    }

    return batches.reduce((promise, batch) => {
      return promise.then(() => {
        return Promise.all(batch.map(operation => operation()));
      });
    }, Promise.resolve());
  };

  // Measure screen load time
  static startScreenLoad = (screenName) => {
    this.performanceMetrics.screenLoadTimes.set(screenName, Date.now());
  };

  static endScreenLoad = (screenName) => {
    const startTime = this.performanceMetrics.screenLoadTimes.get(screenName);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      console.log(`Screen ${screenName} loaded in ${loadTime}ms`);
      return loadTime;
    }
    return null;
  };

  // Get performance metrics
  static getMetrics = () => {
    const uptime = Date.now() - this.performanceMetrics.appStartTime;
    return {
      ...this.performanceMetrics,
      uptime,
      averageScreenLoadTime: this.getAverageScreenLoadTime(),
    };
  };

  // Get average screen load time
  static getAverageScreenLoadTime = () => {
    const times = Array.from(this.performanceMetrics.screenLoadTimes.values());
    if (times.length === 0) return 0;
    
    const total = times.reduce((sum, time) => sum + time, 0);
    return total / times.length;
  };

  // Cleanup
  static cleanup = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
    AppState.removeEventListener('memoryWarning', this.handleMemoryWarning);
    this.isInitialized = false;
  };
}

// Lazy loading utilities
export class LazyLoader {
  static loadedComponents = new Set();
  static loadingPromises = new Map();

  // Lazy load a component
  static loadComponent = async (componentName, importFunction) => {
    if (this.loadedComponents.has(componentName)) {
      return importFunction();
    }

    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName);
    }

    const promise = importFunction().then((component) => {
      this.loadedComponents.add(componentName);
      this.loadingPromises.delete(componentName);
      return component;
    });

    this.loadingPromises.set(componentName, promise);
    return promise;
  };

  // Preload components
  static preloadComponents = (components) => {
    return Promise.all(
      components.map(({ name, importFunction }) =>
        this.loadComponent(name, importFunction)
      )
    );
  };
}

// Memory management utilities
export class MemoryManager {
  static memoryThreshold = 100 * 1024 * 1024; // 100MB
  static currentMemoryUsage = 0;

  // Monitor memory usage
  static monitorMemory = () => {
    // This would require native implementation
    // For now, we'll use a simple heuristic
    return {
      used: this.currentMemoryUsage,
      threshold: this.memoryThreshold,
      isLow: this.currentMemoryUsage > this.memoryThreshold,
    };
  };

  // Optimize memory usage
  static optimizeMemory = () => {
    console.log('Optimizing memory usage...');
    
    // Clear image caches
    ImageOptimizer.clearCache();
    
    // Clear component caches
    LazyLoader.loadedComponents.clear();
    LazyLoader.loadingPromises.clear();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  };

  // Update memory usage (would be called from native side)
  static updateMemoryUsage = (usage) => {
    this.currentMemoryUsage = usage;
    
    if (usage > this.memoryThreshold) {
      this.optimizeMemory();
    }
  };
}

// Network optimization utilities
export class NetworkOptimizer {
  static requestQueue = [];
  static isOnline = true;
  static maxConcurrentRequests = 3;
  static activeRequests = 0;

  // Queue network requests
  static queueRequest = (request) => {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ request, resolve, reject });
      this.processQueue();
    });
  };

  // Process request queue
  static processQueue = () => {
    if (this.activeRequests >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
      return;
    }

    const { request, resolve, reject } = this.requestQueue.shift();
    this.activeRequests++;

    request()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.activeRequests--;
        this.processQueue();
      });
  };

  // Batch network requests
  static batchRequests = (requests, batchSize = 5) => {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }

    return batches.map(batch => 
      Promise.all(batch.map(request => this.queueRequest(request)))
    );
  };
}

export default PerformanceOptimizer;
