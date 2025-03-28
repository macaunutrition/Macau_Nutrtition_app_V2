import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,code) => {
    return await firestore().collection(collectionName).where('code', '==', code).get();
}
