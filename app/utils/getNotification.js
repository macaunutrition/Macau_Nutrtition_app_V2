import firestore from '@react-native-firebase/firestore';
 export default async (collectionName) => {
    return await firestore().collection(collectionName).orderBy("createdAt", "desc").get();
}
