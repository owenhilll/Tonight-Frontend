import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Payment } from '../../../utils/Components/Payment';

export default function Checkout({ eventid }: { eventid: number }) {
  const [duration, setDuration] = useState('');
  const [durationNumeric, setDurationNumeric] = useState(0);
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
  const [err, setErr] = useState('');

  const onPress = () => {
    setErr('');
    let dur = parseInt(duration);
    if (isNaN(dur) || duration == '0') {
      setErr('Please enter a valid duration (any numeric value greater than 0)');
      return;
    } else {
      setDurationNumeric(dur);
      setShowEmbeddedCheckout(!showEmbeddedCheckout);
    }
  };

  return (
    <View>
      <Modal visible={showEmbeddedCheckout} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: Platform.OS == 'web' ? 'auto' : '90%',
              height: Platform.OS == 'web' ? 'auto' : '80%',
              padding: Platform.OS == 'web' ? '5%' : 0,
              backgroundColor: 'black',
            }}
            className="rounded-xl shadow-lg shadow-[#fa7b32]">
            <View className="mt-2 flex-1">
              <TouchableOpacity className="w-7" onPress={() => setShowEmbeddedCheckout(false)}>
                <FontAwesome6 iconStyle="solid" size={25} color="#00E0FF" name="arrow-left" />
              </TouchableOpacity>
              <Payment duration={durationNumeric} eventid={eventid} />
            </View>
          </View>
        </View>
      </Modal>
      <Text className="text-center text-2xl text-white">Promote Event</Text>
      <Text className="mt-10 text-lg text-white">Duration (hrs)</Text>
      <TextInput
        className="rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />
      {err && <Text className="text-center font-bold text-red-400">{err}</Text>}
      <TouchableOpacity
        className="my-3 rounded-2xl bg-[#00E0FF] p-2 text-center text-xl"
        onPress={onPress}>
        <Text className="text-center text-xl text-black">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}
