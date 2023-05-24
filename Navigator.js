
import React from 'react'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticationProvider from './Hooks/AuthProvider';



const stack = createNativeStackNavigator();

export default function Navigator() {

    const { user } = AuthenticationProvider();

    return (
        <stack.Navigator>
            {user ? (
                <>
                    <stack.Screen name='home' component={HomeScreen} />
                </>
            ) : (
                <stack.Screen name='login' component={LoginScreen} />
            )}
        </stack.Navigator>
    )
}
