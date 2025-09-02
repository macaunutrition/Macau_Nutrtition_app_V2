import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { scale } from 'react-native-size-matters';

// Debug component to test Lottie animations on device
const LottieDebugger = ({ source, style }) => {
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [renderMode, setRenderMode] = useState(Platform.OS === 'android' ? 'SOFTWARE' : 'HARDWARE');

  const playAnimation = () => {
    try {
      animationRef.current?.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.log('Play error:', err);
    }
  };

  const pauseAnimation = () => {
    try {
      animationRef.current?.pause();
      setIsPlaying(false);
    } catch (err) {
      setError(err.message);
      console.log('Pause error:', err);
    }
  };

  const resetAnimation = () => {
    try {
      animationRef.current?.reset();
      setIsPlaying(false);
    } catch (err) {
      setError(err.message);
      console.log('Reset error:', err);
    }
  };

  const toggleRenderMode = () => {
    setRenderMode(prev => prev === 'HARDWARE' ? 'SOFTWARE' : 'HARDWARE');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lottie Debugger</Text>
      <Text style={styles.info}>Platform: {Platform.OS}</Text>
      <Text style={styles.info}>Render Mode: {renderMode}</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      
      <View style={[styles.animationContainer, style]}>
        <LottieView
          ref={animationRef}
          source={source}
          autoPlay={false}
          loop={true}
          style={style}
          renderMode={renderMode}
          cacheComposition={false}
          onAnimationReady={() => {
            console.log('Animation ready');
            setError(null);
          }}
          onAnimationError={(err) => {
            console.log('Animation error:', err);
            setError(err.message || 'Unknown error');
          }}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={playAnimation}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pauseAnimation}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={resetAnimation}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={toggleRenderMode}>
          <Text style={styles.buttonText}>Toggle Mode</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.status}>
        Status: {isPlaying ? 'Playing' : 'Paused'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  info: {
    fontSize: scale(14),
    textAlign: 'center',
    marginBottom: scale(5),
  },
  error: {
    fontSize: scale(12),
    color: 'red',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scale(20),
    backgroundColor: 'white',
    borderRadius: scale(10),
    padding: scale(10),
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: scale(20),
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: scale(5),
  },
  buttonText: {
    color: 'white',
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  status: {
    fontSize: scale(16),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LottieDebugger;
