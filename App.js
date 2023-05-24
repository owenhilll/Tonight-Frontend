
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Navigator';
import React from 'react'
import { GetAuthProvider } from './Hooks/AuthProvider';

export default function App() {
  return (
    <NavigationContainer>
      <GetAuthProvider>
        <Navigator />
      </GetAuthProvider>
    </NavigationContainer>
  )
}




