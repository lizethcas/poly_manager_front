import { axiosDashboard } from './axios.config'

export const searchService = {
  async search(query: string) {
    try {
      const response = await axiosDashboard.get(`search/?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      throw error
    }
  }
} 