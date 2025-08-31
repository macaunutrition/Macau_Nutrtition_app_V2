import { AppState } from 'react-native';
import FastImage from 'react-native-fast-image';

class MemoryManager {
  constructor() {
    this.imageCache = new Map();
    this.memoryWarningCallbacks = new Set();
    this.isLowMemory = false;
    
    // Listen for app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    
    // Monitor memory warnings (iOS specific, but good practice)
    this.setupMemoryWarningListener();
  }

  setupMemoryWarningListener() {
    // For iOS memory warnings
    if (global.__DEV__) {
      // In development, we can simulate memory warnings
      setTimeout(() => {
        this.handleMemoryWarning();
      }, 30000); // Simulate after 30 seconds
    }
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      // App went to background, clear some caches
      this.clearOldCaches();
    } else if (nextAppState === 'active') {
      // App came to foreground
      this.isLowMemory = false;
    }
  };

  handleMemoryWarning = () => {
    console.log('Memory warning received, clearing caches...');
    this.isLowMemory = true;
    
    // Clear image caches
    FastImage.clearMemoryCache();
    
    // Clear old image references
    this.clearOldCaches();
    
    // Notify registered callbacks
    this.memoryWarningCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in memory warning callback:', error);
      }
    });
  };

  clearOldCaches = () => {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [key, value] of this.imageCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.imageCache.delete(key);
      }
    }
  };

  // Register callback for memory warnings
  onMemoryWarning = (callback) => {
    this.memoryWarningCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.memoryWarningCallbacks.delete(callback);
    };
  };

  // Preload critical images
  preloadCriticalImages = (urls) => {
    if (this.isLowMemory) {
      console.log('Skipping preload due to low memory');
      return;
    }

    const imagesToPreload = urls.slice(0, 10); // Limit to 10 images
    FastImage.preload(
      imagesToPreload.map(url => ({
        uri: url,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }))
    );
  };

  // Get memory-optimized image props
  getOptimizedImageProps = (uri) => {
    const baseProps = {
      cache: FastImage.cacheControl.immutable,
      priority: FastImage.priority.normal,
    };

    if (this.isLowMemory) {
      return {
        ...baseProps,
        cache: FastImage.cacheControl.web, // Use less aggressive caching
        priority: FastImage.priority.low,
      };
    }

    return baseProps;
  };

  // Track image usage
  trackImageUsage = (uri) => {
    this.imageCache.set(uri, {
      timestamp: Date.now(),
      useCount: (this.imageCache.get(uri)?.useCount || 0) + 1,
    });
  };

  // Cleanup method
  cleanup = () => {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    this.imageCache.clear();
    this.memoryWarningCallbacks.clear();
  };
}

// Singleton instance
const memoryManager = new MemoryManager();

export default memoryManager;

// Hook for React components
export const useMemoryManager = () => {
  const [isLowMemory, setIsLowMemory] = React.useState(memoryManager.isLowMemory);

  React.useEffect(() => {
    const unsubscribe = memoryManager.onMemoryWarning(() => {
      setIsLowMemory(true);
    });

    return unsubscribe;
  }, []);

  return {
    isLowMemory,
    preloadCriticalImages: memoryManager.preloadCriticalImages,
    getOptimizedImageProps: memoryManager.getOptimizedImageProps,
    trackImageUsage: memoryManager.trackImageUsage,
  };
};
