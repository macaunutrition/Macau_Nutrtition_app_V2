import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppState, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

// Device-compatible Lottie Component with fallback handling
const DeviceCompatibleLottie = ({
  source,
  autoPlay = true,
  loop = true,
  style,
  speed = 1,
  pauseOnBackground = true,
  onAnimationFinish,
  fallbackSource,
  ...props
}) => {
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const [animationError, setAnimationError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (pauseOnBackground) {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          // App came to foreground
          if (autoPlay && isVisible && isReady) {
            setTimeout(() => {
              animationRef.current?.play();
            }, 100);
          }
        } else if (nextAppState.match(/inactive|background/)) {
          // App went to background
          animationRef.current?.pause();
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [appState, autoPlay, isVisible, pauseOnBackground, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  // Start animation when component mounts
  useEffect(() => {
    if (autoPlay && isVisible && appState === 'active' && isReady) {
      const timer = setTimeout(() => {
        try {
          animationRef.current?.play();
        } catch (error) {
          console.log('Lottie play error:', error);
          setAnimationError(true);
        }
      }, 200); // Increased delay for device compatibility
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isVisible, appState, isReady]);

  // Handle animation ready
  const handleAnimationReady = useCallback(() => {
    console.log('Lottie animation ready');
    setIsReady(true);
    setAnimationError(false);
  }, []);

  // Handle animation error
  const handleAnimationError = useCallback((error) => {
    console.log('Lottie animation error:', error);
    setAnimationError(true);
  }, []);

  // Force play animation
  const forcePlay = useCallback(() => {
    try {
      animationRef.current?.play();
    } catch (error) {
      console.log('Force play error:', error);
    }
  }, []);

  // Get render mode based on platform
  const getRenderMode = () => {
    if (Platform.OS === 'android') {
      return 'SOFTWARE'; // More compatible on Android devices
    }
    return 'HARDWARE';
  };

  // If animation error and fallback exists, use fallback
  if (animationError && fallbackSource) {
    return (
      <LottieView
        ref={animationRef}
        source={fallbackSource}
        loop={loop}
        speed={speed}
        style={style}
        autoPlay={autoPlay}
        onAnimationFinish={onAnimationFinish}
        renderMode={getRenderMode()}
        cacheComposition={false} // Disable caching for fallback
        onAnimationReady={handleAnimationReady}
        onAnimationError={handleAnimationError}
        {...props}
      />
    );
  }

  return (
    <LottieView
      ref={animationRef}
      source={source}
      loop={loop}
      speed={speed}
      style={style}
      autoPlay={autoPlay}
      onAnimationFinish={onAnimationFinish}
      renderMode={getRenderMode()}
      cacheComposition={true}
      onAnimationReady={handleAnimationReady}
      onAnimationError={handleAnimationError}
      // Additional props for device compatibility
      resizeMode="contain"
      {...props}
    />
  );
};

export default DeviceCompatibleLottie;
