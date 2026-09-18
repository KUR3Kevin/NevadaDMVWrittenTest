jest.mock('expo-router', () => ({
  router: {
    canDismiss: jest.fn(() => true),
    dismissAll: jest.fn(),
    navigate: jest.fn(),
  },
}))

import { router } from 'expo-router'
import { goToTab } from '../src/lib/navigation'

beforeEach(() => {
  jest.clearAllMocks()
  ;(router.canDismiss as jest.Mock).mockReturnValue(true)
})

describe('goToTab', () => {
  it('pops the quiz stack before switching tabs so no duplicate tab screen is left behind', () => {
    goToTab('quiz')
    expect(router.dismissAll).toHaveBeenCalledTimes(1)
    expect(router.navigate).toHaveBeenCalledWith('/(tabs)/quiz')
  })

  it('does not dismiss when there is nothing above the tabs', () => {
    ;(router.canDismiss as jest.Mock).mockReturnValue(false)
    goToTab('study')
    expect(router.dismissAll).not.toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith('/(tabs)/study')
  })
})
