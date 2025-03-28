import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,doc,data) => {
     return await firestore().collection(collectionName).doc(doc).set(data).then(() => {
      //console.log('User added!');
    }).catch(function(e){
      //console.log('kela ', e);
    });

}
