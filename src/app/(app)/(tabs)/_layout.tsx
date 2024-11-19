import { Link, Redirect, Tabs } from 'expo-router';

import { HeaderButton } from '../../../components/HeaderButton';
import { TabBarIcon } from '../../../components/TabBarIcon';
import { useAuth } from '~/src/Context/AuthContext';
import React, { useRef, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';
import { ActiveTabDot, HomeTabIcon, PlansTabIcon } from '~/src/assets/TabIcons/Tabicons';
import { BellIcon } from '~/src/assets/svgs/Svgs';

const AnimatedIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.spring(scaleValue, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return <Animated.View style={{ transform: [{ scale: scaleValue }] }}>{children}</Animated.View>;
};

export default function TabLayout() {
  const activeTabColor = '#41BCC4';

  const TabTitle = ({ focused, title }: { focused: boolean; title: string }) => (
    <View style={{ alignItems: 'center' }}>
      {focused ? (
        <ActiveTabDot width={12} height={15} color={activeTabColor} />
      ) : (
        <Text style={{ color: '#94A1AD' }}>{title}</Text>
      )}
    </View>
  );
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
        tabBarStyle: {
          paddingTop: 10,
          height: 90,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Home" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <HomeTabIcon width={32} height={32} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="second"
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Tracking" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <BellIcon width={20} height={24} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
    </Tabs>
  );
}
