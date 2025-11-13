import { Redirect, Stack, Tabs } from 'expo-router';
import useAuth from '../../Hooks/authContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Text, View } from 'react-native';
export default function RootLayout() {
  const { session, isLoading } = useAuth();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/signIn" />;
  }

  const user = JSON.parse(session ?? '').user;

  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarBackground: () => (
            <LinearGradient
              colors={['#ffffff', '#fffff0']} // Replace with your desired colors
              style={{ flex: 1 }}
            />
          ),
          tabBarStyle: {
            borderRadius: 10,
            borderTopWidth: 0,
            height: 'auto',
            padding: 10,
            marginBottom: 10,
            overflow: 'hidden',
            marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
          },
          tabBarIconStyle: {
            width: '30%',
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
            sceneStyle: {
              marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
              backgroundColor: 'black',
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? 'black' : 'lightgray'}
                name="house"
              />
            ),

            title: '',
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            headerShown: false,
            sceneStyle: {
              marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
              backgroundColor: 'black',
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? 'black' : 'lightgray'}
                name="list"
              />
            ),
            title: '',
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            headerShown: false,
            sceneStyle: {
              marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
              backgroundColor: 'black',
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? 'black' : 'lightgray'}
                name="map-pin"
              />
            ),
            title: '',
          }}
        />

        <Tabs.Screen
          name="bookmarks"
          options={{
            href: !user?.business ? 'bookmarks' : null,
            headerShown: false,
            sceneStyle: {
              marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
              backgroundColor: 'black',
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                size={25}
                color={focused ? 'black' : 'lightgray'}
                name="bookmark"
              />
            ),
            title: '',
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            href: user?.business ? 'profile' : null,
            headerShown: false,
            sceneStyle: {
              marginHorizontal: Platform.OS == 'web' ? '3%' : '2%',
              backgroundColor: 'black',
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                iconStyle="solid"
                color={focused ? 'black' : 'lightgray'}
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
