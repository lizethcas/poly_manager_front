import { describe, it, expect } from 'vitest'
import { useCustomModal } from '../useModal'

describe('useCustomModal', () => {
  it('should initialize with default values', () => {
    const { isOpen, selectedItem } = useCustomModal()
    
    expect(isOpen.value).toBe(false)
    expect(selectedItem.value).toBe(null)
  })

  it('should open modal with item', () => {
    const { isOpen, selectedItem, openModal } = useCustomModal()
    const testItem = { id: 1 }
    
    openModal(testItem)
    
    expect(isOpen.value).toBe(true)
    expect(selectedItem.value).toBe(testItem)
  })

  it('should close modal and reset item', () => {
    const { isOpen, selectedItem, openModal, closeModal } = useCustomModal()
    const testItem = { id: 1 }
    
    openModal(testItem)
    closeModal()
    
    expect(isOpen.value).toBe(false)
    expect(selectedItem.value).toBe(null)
  })
}) 