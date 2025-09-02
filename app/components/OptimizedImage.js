import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-matters';
import { appColors } from '../utils/appColors';
import { ImageOptimizer, ImagePerformanceMonitor, ImagePriority, CacheStrategy } from '../utils/ImageOptimizer';

const placeholder = require('../static/images/default-placeholder.png');

// Enhanced Optimized Image Component with Advanced Performance Features
const OptimizedImage = ({
  source,
  style,
  resizeMode = FastImage.resizeMode.contain,
  onLoad = () => {},
  onError = () => {},
  showLoader = true,
  fallbackSource = placeholder,
  priority = ImagePriority.IMPORTANT,
  cacheStrategy = CacheStrategy.IMMUTABLE,
  enablePerformanceMonitoring = true,
  lazyLoad = false,
  ...props
}) => {
  const [loading, setLoading] = useState(!lazyLoad);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const fadeAnim = useRef(new Animated.Value(lazyLoad ? 0 : 1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const imageRef = useRef(null);

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && source?.uri) {
      ImagePerformanceMonitor.startLoad(source.uri);
    }
  }, [source, enablePerformanceMonitoring]);

  // Shimmer animation for loading state
  useEffect(() => {
    if (loading && showLoader) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [loading, shimmerAnim, showLoader]);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (lazyLoad) {
      // Simple intersection observer simulation
      const timer = setTimeout(() => {
        setIsVisible(true);
        setLoading(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lazyLoad]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    
    // Performance monitoring
    if (enablePerformanceMonitoring && source?.uri) {
      ImagePerformanceMonitor.endLoad(source.uri, true);
    }
    
    // Smooth fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    onLoad();
  }, [fadeAnim, onLoad, source, enablePerformanceMonitoring]);

  const handleError = useCallback((err) => {
    setLoading(false);
    setError(true);
    
    // Performance monitoring
    if (enablePerformanceMonitoring && source?.uri) {
      ImagePerformanceMonitor.endLoad(source.uri, false);
    }
    
    onError(err);
  }, [onError, source, enablePerformanceMonitoring]);

  // Optimized image source with fallback
  const imageSource = error ? fallbackSource : source;
  
  // Get optimized dimensions
  const optimizedStyle = style ? {
    ...style,
    // Ensure minimum dimensions for better performance
    minWidth: style.width || 50,
    minHeight: style.height || 50,
  } : {};

  if (!isVisible) {
    return <View style={optimizedStyle} />;
  }
  
  return (
    <View style={[optimizedStyle, { position: 'relative' }]}>
      {/* Enhanced loading shimmer */}
      {loading && showLoader && (
        <Animated.View
          style={[
            optimizedStyle,
            {
              position: 'absolute',
              backgroundColor: appColors.lightGray,
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.6],
              }),
              zIndex: 2,
              borderRadius: style?.borderRadius || 0,
            },
          ]}
        />
      )}
      
      {/* Optimized FastImage with enhanced configuration */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <FastImage
          ref={imageRef}
          {...props}
          source={imageSource}
          style={optimizedStyle}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          // Enhanced cache configuration
          priority={priority}
          cache={cacheStrategy}
          // Memory optimization
          onMemoryWarning={() => {
            ImageOptimizer.handleMemoryWarning();
          }}
        />
      </Animated.View>
    </View>
  );
};

// Preload critical images
export const preloadImages = (urls) => {
  FastImage.preload(
    urls.map(url => ({
      uri: url,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    }))
  );
};

// Clear cache when memory is low
export const clearImageCache = () => {
  FastImage.clearMemoryCache();
  FastImage.clearDiskCache();
};

export default OptimizedImage;

