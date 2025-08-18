import firestore from '@react-native-firebase/firestore';

export default async (collectionName, type, limit = 0) => {
  if(type == 'parent') {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('parent', '==', null);
      
    if(limit > 0) {
      query = query.limit(limit);
    }
    
    return await query.get();
  } else {
    return await firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('parent', '==', type)
      .get();
  }
}
