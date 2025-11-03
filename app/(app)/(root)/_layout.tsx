import { Stack, Tabs } from 'expo-router';
import useAuth from '../../../Hooks/authContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  const { user } = useAuth();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        overflow: 'visible',
        margin: 0,
        padding: 0,
      }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#284574',
            borderTopWidth: 0,
            overflow: 'hidden',
            height: '8%',
            maxHeight: 75,
            paddingTop: 10,
            justifyContent: 'center',
            marginBottom: 0,
          },
          tabBarIconStyle: {
            justifyContent: 'center',
            padding: 0,
            margin: 0,
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
                style={{ height: '100%' }}
                color={focused ? 'white' : 'black'}
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
                color={focused ? 'white' : 'black'}
                size={25}
                style={{ height: '100%' }}
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
                style={{ height: '100%' }}
                color={focused ? 'white' : 'black'}
                size={25}
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
                color={focused ? 'white' : 'black'}
                size={25}
                name="user"
              />
            ),
            title: '',
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
