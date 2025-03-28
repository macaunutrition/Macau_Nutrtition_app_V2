import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

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
export const fetchAllproducts = async (collectionName, limit = 0) => {
  
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
};

export const fetchNewproducts = async (collectionName, limit = 0) => {
  const today = moment().unix();
  const startDate = moment().subtract(120, 'days').unix();

  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', today)
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
};

// Update fetchBestseller and fetchPopular similarly
export const fetchBestseller = async (collectionName, limit = 0) => {
  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .orderBy('sales', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }

    const querySnapshot = await query.get();

    const productIds = querySnapshot.docs.map(doc => doc.id);
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

    // ... rest of the function remains the same ...

    return { querySnapshot };
  } catch (error) {
    console.error("Error fetching documents: ", error.message);
    return { querySnapshot: { docs: [], size: 0 } };
  }
};

export const fetchPopular = async (collectionName, limit = 0) => {
  try {
    let query = firestore()
      .collection(collectionName)
      .where('status', '==', 'enable')
      .where('special', '==', 'yes')
      .orderBy('createdAt', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }

    const querySnapshot = await query.get();

    const productIds = querySnapshot.docs.map(doc => doc.id);
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
};

export const updateSalesCount = async (cartItems) => {
  const batch = firestore().batch(); // Use batch to perform multiple writes

  for (const item of cartItems) {
    const productRef = firestore().collection('products').doc(item.pid);

    // Assuming `sales` is a field that keeps track of how many times the product was sold
    batch.update(productRef, {
      sales: firestore.FieldValue.increment(1) // Increment the sales count by 1
    });
  }

  await batch.commit(); // Commit all updates
};
