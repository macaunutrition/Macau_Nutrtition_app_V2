import { ADD_TO_CART,REMOVE_FROM_CART,CLEAR_CART,UPDATE_CART_ITEM } from "../cartAction"; //action

const intiialState = {
    cartItems : [] // multiple
}


export default function (state =intiialState,action) {
const {type, payload} =action
    switch (type) {
        case ADD_TO_CART:
         return  {
              ...state,
              cartItems : [...state.cartItems, payload]
          }
        case CLEAR_CART:
           return {
             ...state,
             cartItems: []
           };
        case UPDATE_CART_ITEM:
            return {
              ...state,
              cartItems: state.cartItems.map(item =>
                  item.id === payload.itemId
                    ? { ...item, quantity:  payload.quantity }
                    : item
              )
            };
    case REMOVE_FROM_CART:
        const itemsLeft = state.cartItems?.filter((item,index)=>{
              if(item?.id !=  payload)
              return item
        })
        //console.log({itemsLeft});
        return {
            ...state,
            cartItems : [...itemsLeft]
        }
        default:
            return state
    }


}
