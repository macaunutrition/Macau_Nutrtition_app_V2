export const ADD_TO_WISH_LIST = 'ADD_TO_WISH_LIST'; // ACTION TYPE
export const REMOVE_TO_WISH_LIST = 'REMOVE_TO_WISH_LIST'; // ACTION TYPE
export const CLEAR_WISH_LIST = 'CLEAR_WISH_LIST';

export const addToWishList = (itemInfo) => ({
  type: ADD_TO_WISH_LIST,
  payload: itemInfo,
});
export const clearWhishList = () => ({
  type: CLEAR_WISH_LIST
});
export const removeToWishList = (itemInfo) => ({
  type: REMOVE_TO_WISH_LIST,
  payload: itemInfo,
});
