import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,limit=0) => {
    if(limit > 0) {
        return await firestore().collection(collectionName).where('status', '==', 'enable').limit(limit).get();
    }else {
        return await firestore().collection(collectionName).where('status', '==', 'enable').get();
    }

}
