import { BookmarkIcon, HomeIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { Stack, Tabs } from 'expo-router';
import useAuth from 'Hooks/authContext';

export default function RootLayout() {
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#262626',
          borderRadius: innerWidth / 2,
          marginLeft: '2%',
          marginRight: '2%',
          marginBottom: '1%',
          borderTopColor: 'transparent',
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          borderRadius: innerWidth / 2,
        },
        tabBarActiveBackgroundColor: '#4c4c4c',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <HomeIcon color="#8500ED" />,
          title: '',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <MagnifyingGlassIcon color="#8500ED" />,
          title: '',
        }}
      />

      <Tabs.Screen
        name="bookmarks"
        options={{
          href: !user['business'] ? 'bookmarks' : null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <BookmarkIcon color="#8500ED" />,
          title: 'BookMarks',
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          href: user['business'] ? 'Profile' : null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <UserIcon color="#8500ED" />,
          title: '',
        }}
      />
    </Tabs>
  );
}
