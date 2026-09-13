import React from 'react'
import { Platform } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../src/theme'

type IconName = React.ComponentProps<typeof Ionicons>['name']

function icon(name: IconName, focused: boolean): IconName {
  return focused ? name : `${name}-outline` as IconName
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'web' ? 72 : 84,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'web' ? 10 : 20,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textDim,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 13, marginTop: 2 },
        tabBarItemStyle: { minHeight: 48, minWidth: 0, paddingHorizontal: 0 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={icon('home', focused)} size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarAccessibilityLabel: 'Study',
          tabBarIcon: ({ color, focused }) => <Ionicons name={icon('book', focused)} size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Scores',
          tabBarAccessibilityLabel: 'Scores',
          tabBarIcon: ({ color, focused }) => <Ionicons name={icon('bar-chart', focused)} size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Help',
          tabBarAccessibilityLabel: 'Help and settings',
          tabBarIcon: ({ color, focused }) => <Ionicons name={icon('settings', focused)} size={26} color={color} />,
        }}
      />
    </Tabs>
  )
}
