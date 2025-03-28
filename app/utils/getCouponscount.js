import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,code,userid, type) => {
    if(type == 'overall') {
      return await firestore().collection(collectionName).where('couponcode', '==', code).get();
    }else {
      return await firestore().collection(collectionName).where('couponcode', '==', code).where('user', '==', userid).get();
    }

}
