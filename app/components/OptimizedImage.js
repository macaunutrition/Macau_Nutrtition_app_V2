import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale } from 'react-native-size-matters';
import { appColors } from '../utils/appColors';

const placeholder = require('../static/images/default-placeholder.png');

// Optimized Image Component with Memory Management
const OptimizedImage = ({
  source,
  style,
  resizeMode = FastImage.resizeMode.contain,
  onLoad = () => {},
  onError = () => {},
  showLoader = true,
  fallbackSource = placeholder,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Shimmer animation for loading state
  useEffect(() => {
    if (loading) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [loading, shimmerAnim]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    onLoad();
  }, [fadeAnim, onLoad]);

  const handleError = useCallback((err) => {
    setLoading(false);
    setError(true);
    onError(err);
  }, [onError]);

  // Optimized FastImage configuration
  const imageSource = error ? fallbackSource : source;
  
  return (
    <View style={[style, { position: 'relative' }]}>
      {/* Loading shimmer */}
      {loading && showLoader && (
        <Animated.View
          style={[
            style,
            {
              position: 'absolute',
              backgroundColor: appColors.lightGray,
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
              zIndex: 2,
            },
          ]}
        />
      )}
      
      {/* Optimized FastImage */}
      <Animated.View style={{ opacity: loading ? 0 : fadeAnim }}>
        <FastImage
          {...props}
          source={imageSource}
          style={style}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          // Optimized cache configuration
          priority={FastImage.priority.normal}
          cache={FastImage.cacheControl.immutable}
          // Memory optimization
          onMemoryWarning={() => {
            // Handle memory warnings by reducing cache
            FastImage.clearDiskCache();
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
