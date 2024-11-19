import { Link, Redirect, Tabs } from 'expo-router';

import { HeaderButton } from '../../../components/HeaderButton';
import { TabBarIcon } from '../../../components/TabBarIcon';
import { useAuth } from '~/src/Context/AuthContext';

export default function TabLayout() {
  const { user, hasBeenUsed } = useAuth();

  if (!hasBeenUsed) {
    return <Redirect href={'/(auth)/Onboarding'} />;
  }

  if (!user) {
    return <Redirect href="/(auth)/Login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        // headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="second"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
