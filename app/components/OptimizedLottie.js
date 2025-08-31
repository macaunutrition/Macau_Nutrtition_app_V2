import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import LottieView from 'lottie-react-native';

// Optimized Lottie Component with Lifecycle Management
const OptimizedLottie = ({
  source,
  autoPlay = true,
  loop = true,
  style,
  speed = 1,
  pauseOnBackground = true,
  onAnimationFinish,
  ...props
}) => {
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (pauseOnBackground) {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          // App came to foreground
          if (autoPlay && isVisible) {
            animationRef.current?.play();
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
  }, [appState, autoPlay, isVisible, pauseOnBackground]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  // Play/pause based on visibility
  const handleVisibilityChange = useCallback((visible) => {
    setIsVisible(visible);
    if (visible && autoPlay) {
      animationRef.current?.play();
    } else {
      animationRef.current?.pause();
    }
  }, [autoPlay]);

  // Start animation when component mounts
  useEffect(() => {
    if (autoPlay && isVisible && appState === 'active') {
      const timer = setTimeout(() => {
        animationRef.current?.play();
      }, 100); // Small delay to ensure component is ready
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isVisible, appState]);

  return (
    <LottieView
      ref={animationRef}
      source={source}
      loop={loop}
      speed={speed}
      style={style}
      onAnimationFinish={onAnimationFinish}
      // Optimize rendering
      renderMode="HARDWARE"
      // Reduce memory usage
      cacheComposition={true}
      {...props}
    />
  );
};

// Hook for managing multiple Lottie animations
export const useLottieManager = () => {
  const animationsRef = useRef(new Map());

  const registerAnimation = useCallback((id, animationRef) => {
    animationsRef.current.set(id, animationRef);
  }, []);

  const unregisterAnimation = useCallback((id) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.pause();
      animationsRef.current.delete(id);
    }
  }, []);

  const pauseAll = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      animation.pause();
    });
  }, []);

  const resumeAll = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      animation.play();
    });
  }, []);

  const cleanup = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      animation.pause();
    });
    animationsRef.current.clear();
  }, []);

  return {
    registerAnimation,
    unregisterAnimation,
    pauseAll,
    resumeAll,
    cleanup,
  };
};

export default OptimizedLottie;

