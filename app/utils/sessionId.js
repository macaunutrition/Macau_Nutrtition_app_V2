import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE_KEY = 'sessionId';

const generateRandomId = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let output = '';
  for (let i = 0; i < 32; i += 1) {
    output += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return output;
};

export const getOrCreateSessionId = async () => {
  try {
    const existing = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const created = generateRandomId();
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch (error) {
    // Fallback to ephemeral id if storage fails
    return generateRandomId();
  }
};



