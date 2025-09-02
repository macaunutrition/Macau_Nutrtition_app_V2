import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reset the intro state to show intro again
 * Useful for testing purposes
 */
export const resetIntro = async () => {
  try {
    await AsyncStorage.removeItem('isIntro');
    console.log('Intro state reset successfully');
  } catch (error) {
    console.error('Error resetting intro state:', error);
  }
};

/**
 * Check if intro has been shown
 */
export const isIntroShown = async () => {
  try {
    const introShown = await AsyncStorage.getItem('isIntro');
    return introShown === 'yes';
  } catch (error) {
    console.error('Error checking intro state:', error);
    return false;
  }
};

/**
 * Mark intro as shown
 */
export const markIntroAsShown = async () => {
  try {
    await AsyncStorage.setItem('isIntro', 'yes');
    console.log('Intro marked as shown');
  } catch (error) {
    console.error('Error marking intro as shown:', error);
  }
};
