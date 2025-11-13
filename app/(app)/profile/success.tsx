import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { request } from '../../../utils/axios';
import useAuth from '../../../Hooks/authContext';

export const Success = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventId, setEventId] = useState<string | null>('');
  const [duration, setDuration] = useState<string | null>('');
  const router = useRouter();
  const { session } = useAuth();
  const ses = JSON.parse(session ?? '');
  const token = ses.token;

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    setEventId(urlParams.get('eventid'));
    setDuration(urlParams.get('duration'));

    request.get(`/payments/sessionStatus?session_id=${sessionId}`).then((res) => {
      setStatus(res.data.status);
      setCustomerEmail(res.data.customer_email);
    });
  }, []);

  if (status === 'complete') {
    request.post(
      '/events/promote',
      { eventId, duration },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-2xl text-white">Successfully completed transaction!</Text>
        <Text className="text-center text-lg text-white">
          Your event is promoted and has increased visibility!
        </Text>
        <Text className="text-center text-lg text-white">
          A confirmation email will be sent to <Text className="font-bold">{customerEmail}</Text>
        </Text>
        <Text className="text-center text-lg text-white">
          If you have any questions, please email
          <Text className="font-bold"> support@localeapplive.com</Text>
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-[#00E0FF]"
          onPress={() => router.navigate('/profile')}>
          <Text className="p-2 text-lg">Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default Success;
