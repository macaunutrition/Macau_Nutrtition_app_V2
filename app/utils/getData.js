import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,doc) => {
    return await firestore().collection(collectionName).doc(doc).get();
}
