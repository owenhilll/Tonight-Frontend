import { View, Text, Button } from 'react-native'
import React from 'react'
import AuthenticationProvider from '../Hooks/AuthProvider'


export default function LoginScreen() {

    const { user } = AuthenticationProvider();

    return (
        <View>
            <Button title='login' onPress={user}></Button>
        </View>
    )
}