import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, Pressable, TouchableOpacity, Alert, Modal, FlatList, Animated} from 'react-native';
import {scale} from 'react-native-size-matters';
import {appColors} from '../utils/appColors';
import Label from './Label';
import { APP_CURRENY } from '../utils/appConfig';
import {connect} from 'react-redux';
import {addToCart, removeFromCart, updateCartItem} from '../redux/cartAction';
import ReduxWrapper from '../utils/ReduxWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { APP_IMGURL } from '../utils/appConfig';
import { useTranslation } from "react-i18next";
import "../translation";
import {AlertHelper} from '../utils/AlertHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Debug image URLs
console.log('CheckOutItem - APP_IMGURL:', APP_IMGURL);

// Skeleton Loader Component
const SkeletonLoader = ({ width, height, borderRadius = 0 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: appColors.lightGray,
        opacity,
      }}
    />
  );
};

export default function CheckOutItem({ navigation, renderBagge, hideSteper,noBg, image, item, itemid, name, price, quantity}) {
  const { t, i18n } = useTranslation();
  const [buyqty, setBuyqty] = useState(quantity);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const singleProduct = item.singleproduct;
//console.warn(singleProduct);
const updatecart = (itemid, qty) => {
  // If quantity is 0, remove item from cart
  if (qty === 0) {
    dispatch(removeFromCart(itemid));
    return;
  }

  if(item?.variationname) {
      if(Object.entries(item.sizedetails).length > 0) {
        const maxqty = item.sizedetails.sqty;
        if(qty > maxqty) {
            AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
            return;
        }
      }else {
        const maxqty = item.vqty;
        if(qty > maxqty) {
            AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
            return;
        }
      }
  }else {
    const maxqty = item.qty;
    if(qty > maxqty) {
        AlertHelper.show('error',  t('max')+' '+maxqty+' '+t('youcanbuy'));
        return;
    }
  }
  setBuyqty(qty);
  dispatch(updateCartItem(itemid,qty))
}

// Get maximum available quantity in stock
const getMaxQuantity = () => {
  let maxQty = 0;
  
  if (item.variationname) {
    if (Object.entries(item.sizedetails).length > 0) {
      maxQty = parseInt(item.sizedetails.sqty) || 0;
    } else {
      maxQty = parseInt(item.vqty) || 0;
    }
  } else {
    maxQty = parseInt(item.qty) || 0;
  }
  
  // Ensure we have a valid positive number
  return Math.max(0, maxQty);
};

// Get stock information for display
const getStockInfo = () => {
  const maxQty = getMaxQuantity();
  if (maxQty === 0) {
    return t('outOfStock') || 'Out of Stock';
  } else if (maxQty <= 5) {
    return `${t('only')} ${maxQty} ${t('left')}` || `Only ${maxQty} left`;
  } else {
    return `${t('inStock')} ${maxQty}` || `In Stock: ${maxQty}`;
  }
};

// Get unit price for calculations
const getUnitPrice = () => {
  if (item.variationname) {
    if (Object.entries(item.sizedetails).length > 0 && item.sizedetails.sprice != null) {
      return parseFloat(item.sizedetails.sprice);
    } else {
      return parseFloat(item.vprice);
    }
  } else {
    return parseFloat(item.price);
  }
};

// Calculate total price for the item (unit price × quantity)
const calculateTotalPrice = () => {
  const unitPrice = getUnitPrice();
  return (unitPrice * buyqty).toFixed(2);
};

// Calculate total price for any quantity
const calculateTotalPriceForQuantity = (quantity) => {
  const unitPrice = getUnitPrice();
  return (unitPrice * quantity).toFixed(2);
};

const deleteItem = (itemid) => {
  Alert.alert(
    t('confirmDelete') || 'Confirm Delete',
    t('confirmDeleteMessage') || 'Are you sure you want to remove this item from your cart?',
    [
      {
        text: t('cancel') || 'Cancel',
        style: 'cancel'
      },
      {
        text: t('delete') || 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeFromCart(itemid))
      }
    ]
  );
}
const truncateText = (text,limit) => {
  if(typeof text === 'string') {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  }
  return text;
};
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor:  'white',
        position: 'relative',
      }}>
      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => deleteItem(itemid)}
        style={{
          position: 'absolute',
          top: scale(5),
          right: scale(5),
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: scale(15),
          padding: scale(3.5), // Reduced by 30% from 5 to 3.5
        }}
      >
        <MaterialCommunityIcons
          name="delete"
          size={scale(14)} // Reduced by 30% from 20 to 14
          color={appColors.black}
        />
      </TouchableOpacity>
      <Pressable onPress={() => navigation.navigate('ProductDetails',{pid: singleProduct.pid})} >
      { !item.variationname  && (
        <View style={{ position: 'relative' }}>
          {imageLoading && !imageError && (
            <SkeletonLoader 
              width={scale(130)} 
              height={scale(130)} 
              borderRadius={scale(noBg ? 5 : 0)} 
            />
          )}
          <Image
            style={{
              height: scale(130),
              width: scale(130),
              borderRadius: scale(noBg ? 5 : 0),
              backgroundColor: 'white', // Always white background for transparent images
              position: imageLoading ? 'absolute' : 'relative',
              opacity: imageLoading ? 0 : 1,
            }}
            source={{uri: APP_IMGURL+'/products/'+item.pid+'/'+image}}
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            resizeMode="cover"
          />
          {imageError && (
            <View style={{
              height: scale(130),
              width: scale(130),
              borderRadius: scale(noBg ? 5 : 0),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: appColors.lightGray,
            }}>
              <MaterialCommunityIcons
                name="image-off"
                size={scale(40)}
                color={appColors.gray}
              />
            </View>
          )}
        </View>
      )}
      { item.variationname  && (
        <View style={{ position: 'relative' }}>
          {imageLoading && !imageError && (
            <SkeletonLoader 
              width={scale(130)} 
              height={scale(130)} 
              borderRadius={scale(noBg ? 5 : 0)} 
            />
          )}
          <Image
            style={{
              height: scale(130),
              width: scale(130),
              borderRadius: scale(noBg ? 5 : 0),
              backgroundColor: 'white', // Always white background for transparent images
              position: imageLoading ? 'absolute' : 'relative',
              opacity: imageLoading ? 0 : 1,
            }}
            source={{ 
              uri: item.vimage 
                ? APP_IMGURL + '/products/' + item.pid + '/' + item.variation + '/' + item.vimage 
                : APP_IMGURL + '/products/' + item.pid + '/' + image 
            }}
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            resizeMode="cover"
          />
          {imageError && (
            <View style={{
              height: scale(130),
              width: scale(130),
              borderRadius: scale(noBg ? 5 : 0),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: appColors.lightGray,
            }}>
              <MaterialCommunityIcons
                name="image-off"
                size={scale(40)}
                color={appColors.gray}
              />
            </View>
          )}
        </View>
      )}

      </Pressable>

      <View
        style={{
          marginLeft: scale(0),
          justifyContent: 'space-between',
          paddingVertical: scale(10),
          paddingHorizontal: scale(5),
        }}>
        <>
        {i18n.language == 'en' ? (
          <Label text={truncateText(item.name,15)} style={{fontWeight: '600' ,}} />) : (
            <Label text={truncateText(item.cname,10)} style={{fontWeight: '600' ,}} /> )}
        </>

        { !item.variationname  && (
          <View>
            <Label
              text={`${APP_CURRENY.symbol} ${item.price} each`}
              style={{
                fontSize: scale(12),
                fontWeight: '400',
                color: appColors.gray,
              }}
            />
            <Label
              text={`Total: ${APP_CURRENY.symbol} ${calculateTotalPrice()}`}
              style={{
                fontSize: scale(16),
                fontWeight: '600',
                color: appColors.primaryDark,
              }}
            />
          </View>
        )}
        { item.variationname  && (
          <>
            { Object.entries(item.sizedetails).length > 0 ? (
              <>
                                  {item.sizedetails.sprice != null ? (
                   <View>
                     <Label
                       text={`${APP_CURRENY.symbol} ${item.sizedetails.sprice} each`}
                       style={{
                         fontSize: scale(12),
                         fontWeight: '400',
                         color: appColors.gray,
                       }}
                     />
                     <Label
                       text={`Total: ${APP_CURRENY.symbol} ${calculateTotalPrice()}`}
                       style={{
                         fontSize: scale(16),
                         fontWeight: '600',
                         color: appColors.primaryDark,
                       }}
                     />
                   </View>
                  ) : (
                   <View>
                     <Label
                       text={`${APP_CURRENY.symbol} ${item.vprice} each`}
                       style={{
                         fontSize: scale(12),
                         fontWeight: '400',
                         color: appColors.gray,
                       }}
                     />
                     <Label
                       text={`Total: ${APP_CURRENY.symbol} ${calculateTotalPrice()}`}
                       style={{
                         fontSize: scale(16),
                         fontWeight: '600',
                         color: appColors.primaryDark,
                       }}
                     />
                   </View>
                  )}
                </>
              ) : (
               <View>
                 <Label
                   text={`${APP_CURRENY.symbol} ${item.vprice} each`}
                   style={{
                     fontSize: scale(12),
                     fontWeight: '400',
                     color: appColors.gray,
                   }}
                 />
                 <Label
                   text={`Total: ${APP_CURRENY.symbol} ${calculateTotalPrice()}`}
                   style={{
                     fontSize: scale(16),
                     fontWeight: '600',
                     color: appColors.primaryDark,
                   }}
                 />
               </View>
              )}

        </>)}
        { item.variationname  && (
          <>
          {i18n.language == 'en' ? (
            <Label
              text={item.variationname+' : '+truncateText(item.optionname,20)}
              style={{
                fontSize: scale(11),
                fontWeight: '500',
                color: appColors.black,
              }}
            />) : (
              <Label
                text={item.variationcname+' : '+truncateText(item.optioncname,10)}
                style={{
                  fontSize: scale(11),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              /> )}
          </>
           )}
          {  item.sizedetails && Object.entries(item.sizedetails).length > 0 && (
            <>
            {item.sizedetails.sweight != undefined && (
              <Label
                text={t('weight')+' : '+item.sizedetails.sweight}
                style={{
                  fontSize: scale(11),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              />
            )}
            </>)}
            { item.manfacid && (
              <>
              {i18n.language == 'en' ? (
                <Label
                  text={t('brand')+' : '+item.manfac}
                  style={{
                    fontSize: scale(11),
                    fontWeight: '500',
                    color: appColors.black,
                  }}
                /> ) : (
                  <Label
                    text={t('brand')+' : '+item.cmanfac}
                    style={{
                      fontSize: scale(11),
                      fontWeight: '500',
                      color: appColors.black,
                    }}
                  /> )}
              </>
              )}

            {/* Stock Information and Quantity Selector */}
            <View
              style={{
                paddingTop: scale(5),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: scale(175),
                marginRight: scale(0), // Reduced from 2 to 0 (moved more to the right)
              }}>
              <View style={{width:scale(70)}}>
                {/* Stock Information Above Quantity */}
                <View style={{
                  marginBottom: scale(3),
                }}>
                  <Label 
                    text={getStockInfo()} 
                    style={{
                      fontSize: scale(10),
                      fontWeight: '400',
                      color: getMaxQuantity() === 0 ? '#FF0000' : getMaxQuantity() <= 5 ? '#FF6B00' : appColors.gray,
                      textAlign: 'left',
                    }} 
                  />
                </View>
                <Label text={t('quantity')} style={{fontSize: scale(12),fontWeight: '500'}} />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => setShowQuantityModal(true)}
                  style={{
                    backgroundColor: appColors.lightGray,
                    borderRadius: scale(4), // Reduced by 15% from 5 to 4
                    paddingHorizontal: scale(7), // Reduced by 15% from 8 to 7
                    paddingVertical: scale(3), // Reduced by 15% from 4 to 3
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: scale(26), // Reduced by 15% from 30 to 26
                    width: scale(38), // Reduced by 15% from 45 to 38
                    marginTop: scale(15), // Move down to align with "Quantity" word
                  }}
                >
                  <Label 
                    text={buyqty.toString()} 
                    style={{
                      fontSize: scale(11), // Reduced by 15% from 12 to 11
                      fontWeight: '500',
                      color: appColors.black,
                    }} 
                  />
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={scale(12)}
                    color={appColors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

        {renderBagge&&renderBagge()}
      </View>

      {/* Quantity Selection Modal */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: scale(10),
            padding: scale(20),
            minWidth: scale(250),
            maxHeight: scale(400),
          }}>
            <Label 
              text={t('selectQuantity')} 
              style={{
                fontSize: scale(16),
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: scale(15),
              }}
            />
            
            <FlatList
              data={Array.from({length: getMaxQuantity() + 1}, (_, i) => i)}
              keyExtractor={(item) => item.toString()}
              renderItem={({item: qty}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (qty === 0) {
                      setShowQuantityModal(false);
                      // Show delete confirmation for quantity 0
                      Alert.alert(
                        t('confirmDelete') || 'Confirm Delete',
                        t('confirmDeleteMessage') || 'Are you sure you want to remove this item from your cart?',
                        [
                          {
                            text: t('cancel') || 'Cancel',
                            style: 'cancel'
                          },
                          {
                            text: t('delete') || 'Delete',
                            style: 'destructive',
                            onPress: () => dispatch(removeFromCart(itemid))
                          }
                        ]
                      );
                    } else {
                      updatecart(itemid, qty);
                      setShowQuantityModal(false);
                    }
                  }}
                  style={{
                    paddingVertical: scale(12),
                    paddingHorizontal: scale(15),
                    borderBottomWidth: 1,
                    borderBottomColor: appColors.lightGray,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Label 
                      text={qty === 0 ? t('removeItem') : `Qty: ${qty}`} 
                      style={{
                        fontSize: scale(14),
                        color: qty === 0 ? '#FF0000' : appColors.black,
                        fontWeight: buyqty === qty ? '600' : '400',
                      }}
                    />
                    {qty > 0 && (
                      <Label 
                        text={`${APP_CURRENY.symbol} ${calculateTotalPriceForQuantity(qty)}`} 
                        style={{
                          fontSize: scale(12),
                          color: appColors.gray,
                          marginTop: scale(2),
                        }}
                      />
                    )}
                  </View>
                  {buyqty === qty && (
                    <MaterialCommunityIcons
                      name="check"
                      size={scale(16)}
                      color={appColors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={{
                maxHeight: scale(250),
              }}
            />
            
            <TouchableOpacity
              onPress={() => setShowQuantityModal(false)}
              style={{
                backgroundColor: appColors.lightGray,
                borderRadius: scale(5),
                paddingVertical: scale(10),
                alignItems: 'center',
                marginTop: scale(15),
              }}
            >
              <Label 
                text={t('cancel')} 
                style={{
                  fontSize: scale(14),
                  fontWeight: '500',
                  color: appColors.black,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
