import {ADD_TO_WISH_LIST, REMOVE_TO_WISH_LIST,CLEAR_WISH_LIST, IS_IN_WISH_LIST} from '../wishListAction'; //action

const intiialState = {
  wishItems: [], // multiple
  wishItemNames: [], // multiple
};

export default function (state = intiialState, action) {
  const {type, payload} = action;
  switch (type) {
    case ADD_TO_WISH_LIST:
      return {
        ...state,
        wishItems: [...state.wishItems, payload],
        wishItemNames:[...state.wishItemNames,payload?.pid ]
      };
    case CLEAR_WISH_LIST:
       return {
         ...state,
         wishItems: [],
         wishItemNames:[]
       };
    case REMOVE_TO_WISH_LIST:
      const itemsLeft = state.wishItems?.filter((item, index) => {
        if (item?.pid != payload?.pid) return item;
      });
      const tmpwishItemNames=state?.wishItemNames ?.filter((item, index) => {
        if (item != payload?.pid) return item;
      });
      return {
        ...state,
        wishItems: [...itemsLeft],
        wishItemNames :tmpwishItemNames
      };
    default:
      return state;
  }
}
