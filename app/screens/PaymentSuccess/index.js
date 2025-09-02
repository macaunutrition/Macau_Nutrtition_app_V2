import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import DeviceCompatibleLottie from '../../components/DeviceCompatibleLottie';
import { appColors } from '../../utils/appColors';
import { useTranslation } from "react-i18next";
import "../../translation";
import Feather from 'react-native-vector-icons/Feather';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { orderId, orderData } = route.params || {};
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show success animation for 4 seconds to let the "Process complete" animation finish, then show buttons
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        <DeviceCompatibleLottie
          source={require('../../static/payment_success.json')} // Your Process complete.json Lottie
          autoPlay={true}
          loop={false}
          style={styles.lottieAnimation}
          pauseOnBackground={false}
          speed={1}
          fallbackSource={require('../../static/bikelotti.json')} // Fallback animation
          onAnimationFinish={() => {
            console.log('Payment success animation finished');
          }}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.successText}>
          Payment Successful!
        </Text>
        <Text style={styles.subText}>
          Your order has been placed successfully
        </Text>
        {orderId && (
          <Text style={styles.orderIdText}>
            Order ID: #{orderId}
          </Text>
        )}
      </View>

      {showButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleViewOrders}
          >
            <Feather name="shopping-bag" size={scale(18)} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              View Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleContinueShopping}
          >
            <Feather name="home" size={scale(18)} color={appColors.primary} />
            <Text style={styles.secondaryButtonText}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: scale(250),
    height: scale(250),
  },
  textContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  successText: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: appColors.primary,
    textAlign: 'center',
    marginBottom: scale(10),
  },
  subText: {
    fontSize: scale(16),
    color: '#666666',
    textAlign: 'center',
    lineHeight: scale(22),
    marginBottom: scale(10),
  },
  orderIdText: {
    fontSize: scale(14),
    color: appColors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    width: '100%',
  },
  primaryButton: {
    backgroundColor: appColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(13),
    paddingHorizontal: scale(28),
    borderRadius: scale(23),
    marginBottom: scale(13),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: '600',
    marginLeft: scale(6),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: appColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(13),
    paddingHorizontal: scale(28),
    borderRadius: scale(23),
    width: '100%',
  },
  secondaryButtonText: {
    color: appColors.primary,
    fontSize: scale(14),
    fontWeight: '600',
    marginLeft: scale(6),
  },
});

export default PaymentSuccessScreen;
