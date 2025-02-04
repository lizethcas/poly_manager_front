import { describe, it, expect } from 'vitest'
import { useModal } from '../useModal'

describe('useModal', () => {
  it('should start with modal closed', () => {
    const { isOpen, selectedItem } = useModal()
    
    expect(isOpen.value).toBe(false)
    expect(selectedItem.value).toBe(null)
  })

  it('should open modal with item', () => {
    const { isOpen, selectedItem, openModal } = useModal()
    const testItem = { id: 1, name: 'Test' }
    
    openModal(testItem)
    
    expect(isOpen.value).toBe(true)
    expect(selectedItem.value).toEqual(testItem)
  })

  it('should close modal and clear selected item', () => {
    const { isOpen, selectedItem, openModal, closeModal } = useModal()
    
    openModal({ id: 1 })
    closeModal()
    
    expect(isOpen.value).toBe(false)
    expect(selectedItem.value).toBe(null)
  })
}) 