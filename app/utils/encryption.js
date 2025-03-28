import RSAKey from 'react-native-rsa-native';
import { MACAU_PASS_RSA2_PUBLIC_KEY, MACAU_PASS_RSA2_PRIVATE_KEY, PAYMENT_PUBLIC_KEY } from './constants';
export async function rsaSign(data) {
  try {
    return RSAKey.signWithAlgorithm(data, MACAU_PASS_RSA2_PRIVATE_KEY, 'SHA256withRSA'); // Adjust hashing algorithm as needed
  } catch (error) {
    console.warn('Error signing data:', error);
    //throw new Error('Failed to sign data');
  }
}
export async function rsaVerify(data, signature) {
  try {
    return RSAKey.verifyWithAlgorithm(signature, data, MACAU_PASS_RSA2_PUBLIC_KEY, 'SHA256withRSA'); // Adjust hashing algorithm as needed
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw new Error('Failed to verify signature');
  }
}

// export async function generateKeys(data) {
//   try {
//     const keys = await RSAKey.generateKeys(2048); // You can also load keys if you have them
//     const publicKey = keys.public; // PEM format public key
//     const privateKey = keys.private; // PEM format private key
//     console.log('Pub ', publicKey);
//     console.warn('Pri ', privateKey);
//     return { publicKey, privateKey };
//
//   } catch (error) {
//     console.warn('Error signing data:', error);
//     //throw new Error('Failed to sign data');
//   }
// }
