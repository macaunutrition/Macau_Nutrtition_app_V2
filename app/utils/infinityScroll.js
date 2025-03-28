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
export const fetchProducts = async (collectionName,limit = 0) => {  
  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .orderBy('createdAt', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }

    const querySnapshot = await query.get();

    // Get all product IDs
    const productIds = querySnapshot.docs.map(doc => doc.id);

    // Fetch ratings using the new helper function
    const ratings = await fetchRatings(productIds);

    querySnapshot.docs.forEach(doc => {
      const rating = ratings
        .filter(rating => rating.data().productId === doc.id)
        .map(rating => rating.data());

      if (rating.length > 0) {
        doc.data().averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
      } else {
        doc.data().averageRating = '';
      }
    });

    return { querySnapshot };
  } catch (error) {
    console.error("Error fetching documents: ", error.message);
    return { querySnapshot: { docs: [], size: 0 } };
  }



}
//Category Products
export const fetchCatProducts = async (collectionName,catid,limit = 0) => {
  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('category', 'array-contains', catid)
      .orderBy('createdAt', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }
    const querySnapshot = await query.get();
    // Get all product IDs
    const productIds = querySnapshot.docs.map(doc => doc.id);

    // Fetch ratings using the new helper function
    const ratings = await fetchRatings(productIds);

    querySnapshot.docs.forEach(doc => {
      const rating = ratings
        .filter(rating => rating.data().productId === doc.id)
        .map(rating => rating.data());

      if (rating.length > 0) {
        doc.data().averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
      } else {
        doc.data().averageRating = '';
      }
    });
    return { querySnapshot }
  } catch (error) {
    console.error("Error fetching documents: ", error.message);
    return { querySnapshot: { docs: [], size: 0 } };
  }
}

//Brands Products
export const fetchBrandProducts = async (collectionName,brandid,limit = 0) => {
  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('manfacid', '==', brandid)
      .orderBy('createdAt', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }
    const querySnapshot = await query.get();
    // Get all product IDs
    const productIds = querySnapshot.docs.map(doc => doc.id);

    // Fetch ratings using the new helper function
    const ratings = await fetchRatings(productIds);

    querySnapshot.docs.forEach(doc => {
      const rating = ratings
        .filter(rating => rating.data().productId === doc.id)
        .map(rating => rating.data());

      if (rating.length > 0) {
        doc.data().averageRating = rating.reduce((sum, rating) => sum + rating.rating, 0) / rating.length;
      } else {
          doc.data().averageRating = '';
      }
    });
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { querySnapshot, lastVisible }
  } catch (error) {
    console.error("Error fetching documents: ", error.message);
    return { querySnapshot: { docs: [], size: 0 } };
  }
}

