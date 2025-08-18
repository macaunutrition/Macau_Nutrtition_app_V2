import firestore from '@react-native-firebase/firestore';

// Helper function to chunk array into smaller arrays
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i < array.length ? i + size : array.length));
  }
  return chunks;
};

// Modify the rating fetch logic in each function
const fetchRatings = async (productIds) => {
  const chunks = chunkArray(productIds, 30); // Split into chunks of 30
  let allRatings = [];

  // Fetch ratings for each chunk
  for (const chunk of chunks) {
    const ratingsSnapshot = await firestore()
      .collection('ratings')
      .where('productId', 'in', chunk)
      .get();

    allRatings = [...allRatings, ...ratingsSnapshot.docs];
  }

  return allRatings;
};

export default async (collectionName, q, lang) => {
  const query = q.toLowerCase(); // Normalize the input to lowercase
  const resultsMap = new Map(); // To store unique results

  if (lang === 'en') {
    // Fetch all documents from the collection
    const snapshot = await firestore().collection(collectionName).get();
    const productIds = snapshot.docs.map(doc => doc.id);
    const ratings = await fetchRatings(productIds);

    // Filter results manually for case-insensitive matches
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.name?.toLowerCase().includes(query) || // Case-insensitive match for 'name'
        data.description?.toLowerCase().includes(query) || // Case-insensitive match for 'description'
        data.manfac?.toLowerCase().includes(query) || // Case-insensitive match for 'manfac'
        data.model?.toLowerCase().includes(query) // Case-insensitive match for 'model'
      ) {
        const rating = ratings
          .filter(rating => rating.data().productId === doc.id)
          .map(rating => rating.data());

        if (rating.length > 0) {
          data.averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
        } else {
          data.averageRating = '';
        }
        resultsMap.set(doc.id, { id: doc.id, ...data });
      }
    });
  } else {
    // Fetch all documents from the collection
    const snapshot = await firestore().collection(collectionName).get();
    const productIds = snapshot.docs.map(doc => doc.id);
    const ratings = await fetchRatings(productIds);

    // Filter results manually for case-insensitive matches
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.cname?.toLowerCase().includes(query) || // Case-insensitive match for 'cname'
        data.cdescription?.toLowerCase().includes(query) || // Case-insensitive match for 'cdescription'
        data.manfac?.toLowerCase().includes(query) || // Case-insensitive match for 'manfac'
        data.model?.toLowerCase().includes(query) // Case-insensitive match for 'model'
      ) {
        const rating = ratings
          .filter(rating => rating.data().productId === doc.id)
          .map(rating => rating.data());

        if (rating.length > 0) {
          data.averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
        } else {
          data.averageRating = '';
        }
        resultsMap.set(doc.id, { id: doc.id, ...data });
      }
    });
  }

  // Convert Map values to an array and return
  const results = Array.from(resultsMap.values());
  return results;
};