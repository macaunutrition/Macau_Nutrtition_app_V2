import firestore from '@react-native-firebase/firestore';
export const createOrUpdateRating = async (productId, rating, comment, userId) => {
    const ratingsRef = firestore().collection('ratings');
    const userRef = firestore().collection('users').doc(userId);
    const userData = await userRef.get();
    const user = userData.data();
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // Check if the user has already rated this product
    const existingRatingQuery = await ratingsRef
        .where('productId', '==', productId)
        .where('userId', '==', userId)
        .get();

    if (!existingRatingQuery.empty) {
        // Update the existing rating
        const existingRatingDoc = existingRatingQuery.docs[0];
        await existingRatingDoc.ref.update({
            rating,
            comment,
            user,
            status: 'approved',
            date: formattedDate,
        });
        return existingRatingDoc.id;
    } else {
        // Create a new rating
        const newRatingRef = ratingsRef.doc();
        await newRatingRef.set({
            productId,
            rating,
            comment,
            userId,
            user,
            status: 'approved',
            date: formattedDate,
        });
        return newRatingRef.id;
    }
};

export const getRatings = async (productId) => {
    const ratingsRef = firestore().collection('ratings').where('productId', '==', productId).where('status', '==', 'approved');
    const snapshot = await ratingsRef.get();
    if (snapshot.docs.length > 0) {
        const totalRatings = snapshot.docs.length;
        const totalRating = snapshot.docs.reduce((acc, doc) => acc + doc.data().rating, 0);
        const averageRating = parseFloat((totalRating / totalRatings).toFixed(1));
        const rating1 = snapshot.docs.filter((doc) => doc.data().rating === 1).length;
        const rating2 = snapshot.docs.filter((doc) => doc.data().rating === 2).length;
        const rating3 = snapshot.docs.filter((doc) => doc.data().rating === 3).length;
        const rating4 = snapshot.docs.filter((doc) => doc.data().rating === 4).length;
        const rating5 = snapshot.docs.filter((doc) => doc.data().rating === 5).length;
        return {
            totalRatings,
            averageRating,
            rating1,
            rating2,
            rating3,
            rating4,
            rating5,
            ratings: snapshot.docs.map((doc) => doc.data()),
        };
    }else {
        return null;
    }
};

export const checkUserRated = async (productId, userId) => {
    const ratingsRef = firestore().collection('ratings').where('productId', '==', productId).where('userId', '==', userId);
    const snapshot = await ratingsRef.get();
    if (snapshot.docs.length > 0) {
        return snapshot.docs[0].data();
    }
    return null;
};

export const getUserRatings = async (userId) => {
    const ratingsRef = firestore().collection('ratings').where('userId', '==', userId);
    const snapshot = await ratingsRef.get();
    return snapshot.docs.map((doc) => doc.data());
};
export const checkUserBoughtProduct = async (productId, userId) => {
    try {
        const ordersRef = firestore().collection('orders');
        const snapshot = await ordersRef
            .where('user', '==', userId)
            .where('status', '==', 'Complete')
            .get();

        // Check each order's cart items
        for (const doc of snapshot.docs) {
            const orderData = doc.data();
            const cartItems = JSON.parse(orderData.cartItems);
            
            // Check if product exists in cart items
            const productExists = cartItems.some(item => item.pid === productId);
            if (productExists) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error checking product purchase:', error);
        return false;
    }
};
