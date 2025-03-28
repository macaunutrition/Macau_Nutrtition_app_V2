import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,type,limit=0) => {
   if(type == 'parent') {
     if(limit > 0) {
         return await firestore().collection(collectionName).where('status', '==', 'enable').where('parent', '==', null).limit(limit).get();
     }else {
         return await firestore().collection(collectionName).where('status', '==', 'enable').where('parent', '==', null).get();
     }
   }else {
      return await firestore().collection(collectionName).where('status', '==', 'enable').where('parent', '==', type).get();
   }


}
