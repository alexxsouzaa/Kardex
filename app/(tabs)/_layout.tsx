import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '@/components/TabBar';

const TabLayout = () => {

  return (
    <Tabs
      screenOptions={{ headerShown: false}} tabBar={props => <TabBar {...props}/>}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

export default TabLayout