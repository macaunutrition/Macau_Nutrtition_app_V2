import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,limit=0) => {
    let query = firestore()
        .collection(collectionName)
        .where('status', '==', 'enable');

    if (limit > 0) {
        query = query.limit(limit);
    }

    return await query.get();

}
