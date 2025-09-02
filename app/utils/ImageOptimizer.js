import FastImage from 'react-native-fast-image';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Image optimization utilities
export class ImageOptimizer {
  // Preload critical images
  static preloadCriticalImages = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return;
    
    FastImage.preload(
      imageUrls.map(url => ({
        uri: url,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }))
    );
  };

  // Clear cache when memory is low
  static clearCache = () => {
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
  };

  // Get optimized image dimensions
  static getOptimizedDimensions = (originalWidth, originalHeight, maxWidth = screenWidth, maxHeight = screenHeight) => {
    const aspectRatio = originalWidth / originalHeight;
    
    let optimizedWidth = maxWidth;
    let optimizedHeight = maxWidth / aspectRatio;
    
    if (optimizedHeight > maxHeight) {
      optimizedHeight = maxHeight;
      optimizedWidth = maxHeight * aspectRatio;
    }
    
    return {
      width: Math.round(optimizedWidth),
      height: Math.round(optimizedHeight)
    };
  };

  // Get appropriate resize mode based on image dimensions
  static getOptimalResizeMode = (imageWidth, imageHeight, containerWidth, containerHeight) => {
    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    
    if (imageAspectRatio > containerAspectRatio) {
      return FastImage.resizeMode.cover;
    } else {
      return FastImage.resizeMode.contain;
    }
  };

  // Generate optimized image URL with size parameters
  static getOptimizedImageUrl = (baseUrl, width, height, quality = 80) => {
    if (!baseUrl) return null;
    
    // If it's a local image, return as is
    if (typeof baseUrl === 'number' || baseUrl.startsWith('file://')) {
      return baseUrl;
    }
    
    // For remote images, you can add optimization parameters
    // This depends on your backend/CDN setup
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}w=${width}&h=${height}&q=${quality}&f=auto`;
  };

  // Batch preload images with priority
  static batchPreload = (images, priority = FastImage.priority.normal) => {
    const batchSize = 5; // Load 5 images at a time
    const batches = [];
    
    for (let i = 0; i < images.length; i += batchSize) {
      batches.push(images.slice(i, i + batchSize));
    }
    
    batches.forEach((batch, index) => {
      setTimeout(() => {
        FastImage.preload(
          batch.map(image => ({
            uri: image,
            priority: index === 0 ? FastImage.priority.high : priority,
            cache: FastImage.cacheControl.immutable,
          }))
        );
      }, index * 200); // Stagger loading by 200ms
    });
  };

  // Memory management
  static handleMemoryWarning = () => {
    // Clear memory cache but keep disk cache
    FastImage.clearMemoryCache();
    
    // You can also implement more sophisticated memory management
    // like reducing image quality or clearing non-critical images
  };

  // Get cache size
  static getCacheSize = async () => {
    try {
      // This would require native implementation
      // For now, we'll return a placeholder
      return {
        memoryCache: 'Unknown',
        diskCache: 'Unknown'
      };
    } catch (error) {
      console.warn('Could not get cache size:', error);
      return null;
    }
  };
}

// Image loading priorities
export const ImagePriority = {
  CRITICAL: FastImage.priority.high,    // Above the fold, hero images
  IMPORTANT: FastImage.priority.normal, // Product images, categories
  LOW: FastImage.priority.low,          // Background images, decorative
};

// Cache control strategies
export const CacheStrategy = {
  IMMUTABLE: FastImage.cacheControl.immutable, // Never changes
  WEB: FastImage.cacheControl.web,             // Standard web caching
  CACHE_ONLY: FastImage.cacheControl.cacheOnly, // Only from cache
};

// Performance monitoring
export class ImagePerformanceMonitor {
  static loadTimes = new Map();
  static errorCount = 0;
  static successCount = 0;

  static startLoad = (imageUrl) => {
    this.loadTimes.set(imageUrl, Date.now());
  };

  static endLoad = (imageUrl, success = true) => {
    const startTime = this.loadTimes.get(imageUrl);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      this.loadTimes.delete(imageUrl);
      
      if (success) {
        this.successCount++;
        console.log(`Image loaded in ${loadTime}ms: ${imageUrl}`);
      } else {
        this.errorCount++;
        console.warn(`Image failed to load: ${imageUrl}`);
      }
    }
  };

  static getStats = () => {
    return {
      successCount: this.successCount,
      errorCount: this.errorCount,
      successRate: this.successCount / (this.successCount + this.errorCount) * 100
    };
  };

  static reset = () => {
    this.loadTimes.clear();
    this.errorCount = 0;
    this.successCount = 0;
  };
}

export default ImageOptimizer;
