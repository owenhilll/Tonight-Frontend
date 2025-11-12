import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export const Success = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  console.log('idk');
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return <Link href="/checkout" />;
  }

  if (status === 'complete') {
    return (
      <View id="success">
        <Text>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If you
          have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </Text>
      </View>
    );
  }

  return null;
};

export default Success;
