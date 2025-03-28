import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,mobile) => {
    return await firestore().collection(collectionName).where('user', '==', mobile).orderBy('createat', 'desc').get();
}
