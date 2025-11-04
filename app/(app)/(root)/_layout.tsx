import { Stack, Tabs } from 'expo-router';
import useAuth from '../../../Hooks/authContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, View } from 'react-native';

export default function RootLayout() {
  const { user } = useAuth();
  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarBackground: () => (
            <LinearGradient
              colors={['#031370', '#63b6dd']} // Replace with your desired colors
              style={{ flex: 1 }}
            />
          ),
          tabBarStyle: {
            borderRadius: 10,
            borderTopWidth: 0,
            height: Platform.OS == 'web' ? 75 : 50,
            marginBottom: 10,
            overflow: 'hidden',
            marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
          },
          tabBarIconStyle: {
            fontSize: 20,
          },
          sceneStyle: {
            backgroundColor: 'black',
            flex: 1,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? '#20e1fd' : 'black'}
                name="house"
              />
            ),

            title: '',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,

            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? '#20e1fd' : 'black'}
                name="magnifying-glass"
              />
            ),
            title: '',
          }}
        />

        <Tabs.Screen
          name="bookmarks"
          options={{
            href: !user['business'] ? 'bookmarks' : null,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? '#20e1fd' : 'black'}
                name="bookmark"
              />
            ),
            title: '',
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            href: user['business'] ? 'Profile' : null,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                color={focused ? '#20e1fd' : 'black'}
                size={25}
                name="user"
              />
            ),
            title: '',
          }}
        />
      </Tabs>
    </View>
  );
}
