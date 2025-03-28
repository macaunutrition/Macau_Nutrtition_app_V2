import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,doc,data) => {

     return await firestore().collection(collectionName).doc(doc).update(data);
}
