import useAuth from 'Hooks/authContext';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { request } from '../../utils/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51SShgHIz1dRw03M7uEvQKeaGFlVyoWWyOjnIluWSksjzcopz6kJ1w6Durwyu4RRj7gGpSoyJ6eQXfuNafoczujfb00rWHDBeRp'
);
export const Payment = ({ eventid, duration }: { eventid: any; duration: number }) => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return request
      .post(`/payments/checkoutSessionWeb?eventid=${eventid}&duration=${duration}`)
      .then((res) => res.data)
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      {/* Your web payment form using CardElement, PaymentElement, etc. */}
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};
