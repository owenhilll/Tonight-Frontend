import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export default function LoadingIndicator() {
  const spinValue = new Animated.Value(0);

  const startSpinning = () => {
    spinValue.setValue(0); // Reset spin value to 0
    Animated.timing(spinValue, {
      toValue: 1, // Animate to 1
      duration: 1500, // Duration of one spin
      easing: Easing.linear, // Linear easing for a smooth spin
      useNativeDriver: true, // Use native driver for performance
    }).start(() => startSpinning()); // Loop the animation
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  startSpinning();

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome6 name="spinner" size={50} color="#BBDEFB" />
      </Animated.View>
    </View>
  );
}
