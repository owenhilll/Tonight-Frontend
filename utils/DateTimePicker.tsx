import { Platform } from 'react-native';

import { createElement, useState } from 'react';

export const DateSelection = ({
  date,
  setDate,
  defValue,
  type,
}: {
  date: Date;
  setDate: any;
  defValue: any;
  type: string | undefined;
}) => {
  if (Platform.OS === 'web') {
    return createElement('input', {
      type: type,
      defaultValue: defValue,
      min: new Date().toISOString().slice(0, -8),
      style: {
        justifyItems: 'center',
        backgroundColor: 'lightgray',
      },
      value: date,
      className: 'rounded-lg items-center text-lg px-2 justify-center',
      onChange: (event) => setDate(event.target.value),
    });
  }
};
