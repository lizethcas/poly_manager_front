import { Notyf } from 'notyf'
import type { INotyfOptions } from 'notyf'

export const useNotify = () => {
  // Create Notyf instance with default configuration
  const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    dismissible: true,
    types: [
      {
        type: 'success',
        background: '#28a745',
      },
      {
        type: 'error',
        background: '#dc3545',
      },
      {
        type: 'warning',
        background: '#ffc107',
      },
      {
        type: 'info',
        background: '#17a2b8',
      },
    ],
  })

  // Helper functions for common notification types
  const success = (message: string, options?: Partial<INotyfOptions>) => {
    notyf.success({ message, ...options })
  }

  const error = (message: string, options?: Partial<INotyfOptions>) => {
    notyf.error({ message, ...options })
  }

  const warning = (message: string, options?: Partial<INotyfOptions>) => {
    notyf.open({ type: 'warning', message, ...options })
  }

  const info = (message: string, options?: Partial<INotyfOptions>) => {
    notyf.open({ type: 'info', message, ...options })
  }

  return {
    notyf,
    success,
    error,
    warning,
    info,
  }
}
