import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import DeviceCompatibleLottie from '../../components/DeviceCompatibleLottie';
import { appColors } from '../../utils/appColors';
import { useTranslation } from "react-i18next";
import "../../translation";

const PaymentLoadingScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { paymentData, onPaymentComplete } = route.params || {};
  const [processingStep, setProcessingStep] = useState(0);
  const [statusText, setStatusText] = useState('Processing Payment...');

  useEffect(() => {
    // Simulate payment processing steps
    const processPayment = async () => {
      try {
        // Step 1: Validating payment
        setStatusText('Validating Payment...');
        setProcessingStep(1);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 2: Processing transaction
        setStatusText('Processing Transaction...');
        setProcessingStep(2);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 3: Saving order
        setStatusText('Saving Order...');
        setProcessingStep(3);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 4: Finalizing
        setStatusText('Finalizing...');
        setProcessingStep(4);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call the payment completion callback
        if (onPaymentComplete) {
          await onPaymentComplete();
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setStatusText('Error processing payment');
        // Navigate back to summary screen after error
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    };

    processPayment();
  }, [onPaymentComplete, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        <DeviceCompatibleLottie
          source={require('../../static/bikelotti.json')} // Default loading animation
          autoPlay={true}
          loop={true}
          style={styles.lottieAnimation}
          pauseOnBackground={false}
          speed={1}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.loadingText}>
          {statusText}
        </Text>
        <Text style={styles.subText}>
          {t('pleasewait') || 'Please Wait...'}
        </Text>
        
        {/* Progress indicators */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                processingStep >= step ? styles.progressDotActive : styles.progressDotInactive
              ]}
            />
          ))}
        </View>
      </View>
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
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: scale(200),
    height: scale(200),
  },
  textContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  loadingText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: appColors.primary,
    textAlign: 'center',
    marginBottom: scale(10),
  },
  subText: {
    fontSize: scale(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: scale(20),
    marginBottom: scale(20),
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(4),
  },
  progressDotActive: {
    backgroundColor: appColors.primary,
  },
  progressDotInactive: {
    backgroundColor: '#E0E0E0',
  },
});

export default PaymentLoadingScreen;
