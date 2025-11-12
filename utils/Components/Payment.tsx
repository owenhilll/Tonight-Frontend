import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import useAuth from 'Hooks/authContext';
import { useEffect, useState } from 'react';
import { Alert, Button, TouchableOpacity } from 'react-native';
import { request } from 'utils/axios';

export const Payment = ({ item }: { item: any }) => {
  const { token } = useAuth();

  const [publishableKey, setPublishableKey] = useState('');

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(true);

  const fetchPublishableKey = async () => {
    const key = await request.get('/payments/publishablekey', {
      headers: {
        Authorization: token,
      },
    }); // fetch key from your server here
    setPublishableKey(key.data);
  };

  const fetchPaymentSheetParams = async () => {
    const response = await request.post(`/payments/payment-sheet`, {
      headers: {
        authorization: token,
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const Checkout = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <StripeProvider publishableKey={publishableKey}>
      <TouchableOpacity onPress={Checkout} />
    </StripeProvider>
  );
};
