import firestore from '@react-native-firebase/firestore';
 export default async (collectionName,doc,data,type) => {
   if(type == 'simple') {
      return await firestore().collection(collectionName).doc(doc).update(data).then(() => {
        //console.log('User added!');
      }).catch(function(e){
        //console.log('kela ', e);
      });
   }else {
     return await firestore().collection(collectionName).doc(doc).update(data).then(() => {
       //console.log('User added!');
     }).catch(function(e){
       //console.log('kela ', e);
     });
   }

}
