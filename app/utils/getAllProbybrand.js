import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,brandid) => {
    const querySnapshot = await firestore().collection(collectionName).where('manfacid', '==', brandid).get();
    // get ratings and insert in querySnapshot
    const ratings = await firestore().collection('ratings').where('productId', 'in', querySnapshot.docs.map(doc => doc.id)).get();
    querySnapshot.docs.forEach(doc => {
      const rating = ratings.docs.filter(rating => rating.data().productId === doc.id).map(rating => rating.data());
      if(rating.length > 0) {
        doc.data().averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
      }else {
        doc.data().averageRating = '';
      }
    });
    return querySnapshot;
}
