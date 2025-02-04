import { describe, it, expect, beforeEach } from 'vitest'
import { useAnimation } from '../useAnimation'

// Mock document and window
const mockElement = {
  style: {
    opacity: '1',
    transform: '',
  },
  getBoundingClientRect: () => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
  }),
}

beforeEach(() => {
  // Reset element styles
  mockElement.style.opacity = '1'
  mockElement.style.transform = ''
})

describe('useAnimation', () => {
  const { beforeEnter, enter, leave } = useAnimation()

  it('should modify element styles correctly in beforeEnter', () => {
    beforeEnter(mockElement as unknown as HTMLElement)
    expect(mockElement.style.transform).toBe('translateY(100%)')
  })

  it('should modify element transform in enter', () => {
    enter(mockElement as unknown as HTMLElement)
    expect(mockElement.style.transform).toBe('translateY(0)')
  })

  it('should modify element transform in leave', () => {
    leave(mockElement as unknown as HTMLElement)
    expect(mockElement.style.transform).toBe('translateY(100%)')
  })
}) 