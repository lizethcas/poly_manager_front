import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRoutes, get, post, del, patch } from './routes.api'
import { axiosDashboard } from './axios.config'

// Mock del módulo axios.config
vi.mock('./axios.config', () => ({
  axiosDashboard: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
}))

describe('API Routes', () => {
  describe('apiRoutes object', () => {
    it('debe generar URLs correctas para rutas dinámicas', () => {
      expect(apiRoutes.students.getCourseByStudent('123')).toBe('students/123/courses/')
      expect(apiRoutes.scenarios.getById('456')).toBe('scenarios/456/')
      expect(apiRoutes.course.getById('789')).toBe('/courses/?courseId=789')
      expect(apiRoutes.classes.getById(101)).toBe('classes/101/')
    })

    it('debe tener rutas estáticas correctas', () => {
      expect(apiRoutes.login).toBe('login/')
      expect(apiRoutes.chat.chatAi).toBe('chat-ai/')
      expect(apiRoutes.classContent).toBe('class-contents/')
    })
  })

  describe('HTTP Methods', () => {
    const mockData = { test: 'data' }
    const mockResponse = { data: mockData }
    const testUrl = 'test-url'

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('get debe hacer una petición GET correcta', async () => {
      vi.mocked(axiosDashboard.get).mockResolvedValue(mockResponse)
      
      const result = await get(testUrl)
      
      expect(axiosDashboard.get).toHaveBeenCalledWith(testUrl)
      expect(result).toEqual(mockData)
    })

    it('post debe hacer una petición POST correcta', async () => {
      vi.mocked(axiosDashboard.post).mockResolvedValue(mockResponse)
      
      const result = await post(testUrl, mockData)
      
      expect(axiosDashboard.post).toHaveBeenCalledWith(testUrl, mockData)
      expect(result).toEqual(mockData)
    })

    it('del debe hacer una petición DELETE correcta', async () => {
      vi.mocked(axiosDashboard.delete).mockResolvedValue(mockResponse)
      
      await del(testUrl)
      
      expect(axiosDashboard.delete).toHaveBeenCalledWith(testUrl)
    })

    it('patch debe hacer una petición PATCH correcta', async () => {
      vi.mocked(axiosDashboard.patch).mockResolvedValue(mockResponse)
      
      const result = await patch(testUrl, mockData)
      
      expect(axiosDashboard.patch).toHaveBeenCalledWith(testUrl, mockData)
      expect(result).toEqual(mockData)
    })

    it('debe manejar errores correctamente', async () => {
      const error = new Error('Network Error')
      vi.mocked(axiosDashboard.get).mockRejectedValue(error)
      
      await expect(get(testUrl)).rejects.toThrow('Network Error')
    })
  })
})