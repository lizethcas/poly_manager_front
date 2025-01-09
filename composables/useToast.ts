// Importar el paquete por defecto
import Toastification from 'vue-toastification'

// Acceder a la función useToast desde el paquete
const { useToast: useVueToast } = Toastification()

export const useCustomToast = () => {
  const toast = useVueToast()

  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message)
  }
}

export const useToast = useCustomToast
