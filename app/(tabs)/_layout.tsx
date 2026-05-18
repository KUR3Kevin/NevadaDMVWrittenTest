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
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMute,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
      }}
    >
      <Tabs.Screen name="quiz" options={{ title: 'Quiz', tabBarIcon: ({ color, size, focused }) => <Ionicons name={icon('play-circle', focused)} size={size} color={color} /> }} />
      <Tabs.Screen name="study" options={{ title: 'Study', tabBarIcon: ({ color, size, focused }) => <Ionicons name={icon('book', focused)} size={size} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color, size, focused }) => <Ionicons name={icon('bar-chart', focused)} size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size, focused }) => <Ionicons name={icon('settings', focused)} size={size} color={color} /> }} />
    </Tabs>
  )
}
