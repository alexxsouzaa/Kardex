import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '@/components/TabBar';
import { useAppFonts } from '@/hooks/fontsConfig';

const TabLayout = () => {
    const fontsLoaded = useAppFonts();

    if (!fontsLoaded) {
        return null;
    }

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
        name="inventory"
        options={{
          title: 'Estoque',
        }}
      />
      <Tabs.Screen
        name="cadastre"
        options={{
          title: 'Cadastrar',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Relatórios',
        }}
      />      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Opções',
        }}
      />
    </Tabs>
  );
}

export default TabLayout