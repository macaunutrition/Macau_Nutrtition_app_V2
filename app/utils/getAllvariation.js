import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,productid) => {
    return await firestore().collection(collectionName).where('productid', '==', productid).get();
}
