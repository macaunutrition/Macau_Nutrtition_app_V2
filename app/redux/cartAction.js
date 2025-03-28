export const ADD_TO_CART = "ADD_TO_CART" // ACTION TYPE
export const REMOVE_FROM_CART = "REMOVE_FROM_CART" // ACTION TYPE
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
/**
 *
 * @param {*} item
 * @returns
 * @description add to cart action
 */
 export const addToCart = (item)=>({
    type: ADD_TO_CART,
    payload : item
})



export const removeFromCart = (itemId)=>({
    type: REMOVE_FROM_CART,
    payload : itemId
})
export const clearCart = () => ({
  type: CLEAR_CART
});

export const updateCartItem = (itemId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { itemId, quantity }
});
