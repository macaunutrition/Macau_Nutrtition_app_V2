import firestore from '@react-native-firebase/firestore';

export default async (collectionName, q, lang) => {
  const query = q.toLowerCase(); // Normalize the input to lowercase
  const resultsMap = new Map(); // To store unique results

  if (lang === 'en') {
    // Fetch all documents from the collection
    const snapshot = await firestore().collection(collectionName).get();

    // Filter results manually for case-insensitive matches
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.name?.toLowerCase().includes(query) || // Case-insensitive match for 'name'
        data.description?.toLowerCase().includes(query) || // Case-insensitive match for 'description'
        data.manfac?.toLowerCase().includes(query) || // Case-insensitive match for 'manfac'
        data.model?.toLowerCase().includes(query) // Case-insensitive match for 'model'
      ) {
        resultsMap.set(doc.id, { id: doc.id, ...data });
      }
    });
  } else {
    // Fetch all documents from the collection
    const snapshot = await firestore().collection(collectionName).get();

    // Filter results manually for case-insensitive matches
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.cname?.toLowerCase().includes(query) || // Case-insensitive match for 'cname'
        data.cdescription?.toLowerCase().includes(query) || // Case-insensitive match for 'cdescription'
        data.manfac?.toLowerCase().includes(query) || // Case-insensitive match for 'manfac'
        data.model?.toLowerCase().includes(query) // Case-insensitive match for 'model'
      ) {
        resultsMap.set(doc.id, { id: doc.id, ...data });
      }
    });
  }

  // Convert Map values to an array and return
  const results = Array.from(resultsMap.values());
  return results;
};