import { router } from 'expo-router'

export type TabName = 'quiz' | 'study' | 'progress' | 'settings'

/**
 * Return to a bottom tab from anywhere in the app.
 *
 * Quiz and results screens live in the root stack above the tabs. Using
 * `router.replace('/(tabs)/…')` from there pushes a second copy of the tab
 * navigator on top of the first, so every finished quiz leaves an extra
 * hidden Home screen behind (and the browser Back button lands on it).
 * Popping back to the original tabs first keeps the stack flat.
 */
export function goToTab(tab: TabName): void {
  if (router.canDismiss()) router.dismissAll()
  router.navigate(`/(tabs)/${tab}`)
}
