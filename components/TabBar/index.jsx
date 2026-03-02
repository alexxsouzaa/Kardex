import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";

export default function TabBar({ state, descriptors, navigation }) {
  const icons = {
    index: 'home',
    settings: 'settings',
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        borderRadius: 80,
        backgroundColor: "transparent",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderRadius: 80,
          padding: 4,
          gap: 12,
          alignItems: 'center',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={{
                height: 68,
                width: 68,
                borderRadius: 60,
                backgroundColor: isFocused ? "#FF4F18" : "transparent",
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: "center",
                gap: 4
              }}
            >
              <Ionicons
                name={icons[route.name] || 'help-circle-outline'}
                size={24}
                color={isFocused ? "#fff" : "#000"}
              />
              {!isFocused && (
                <Text style={{ color: "#000", fontSize: 12, fontWeight: '400' }}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
