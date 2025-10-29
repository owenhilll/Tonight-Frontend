import { Platform } from 'react-native';

import DatePicker from 'react-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createElement, useState } from 'react';

export const DateSelection = ({
  date,
  setDate,
  defValue,
  type,
}: {
  date: any;
  setDate: any;
  defValue: any;
  type: string | undefined;
}) => {
  if (Platform.OS === 'web') {
    return createElement('input', {
      type: type,
      defaultValue: defValue,
      style: {
        justifyItems: 'center',
        backgroundColor: 'lightgray',
      },
      value: date,
      className:
        'rounded-full items-center text-lg border-purple-300 border-2 p-0 mx-2 justify-center bg-red-300',
      onChange: (event) => setDate(event.target.value),
    });
  } else {
    return <DateTimePicker onChange={setDate} value={date} />;
  }
};
