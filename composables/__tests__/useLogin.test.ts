import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin } from '../useLogin'


// Mock the store and toast with proper types
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    setAuth: vi.fn(),
    $state: {},
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn()
  })
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: vi.fn(),
    success: vi.fn(),
    clear: vi.fn(),
    updateDefaults: vi.fn(),
    dismiss: vi.fn(),
    update: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  })
}))

// Mock API routes
vi.mock('@/services/routes.api', () => ({
  post: vi.fn()
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle successful login', async () => {
    const { loginMutation } = useLogin()
    
    const mockResponse = {
      status: 'success',
      token: 'test-token',
      user_data: { name: 'Test User' },
      user_type: 'student',
      user: { id: 1 }
    }
    
    await loginMutation.mutate({ 
      email: 'test@example.com', 
      password: 'password' 
    })
    
    // Verify the auth store was called with correct data
    expect(vi.mocked(useAuthStore)().setAuth).toHaveBeenCalledWith({
      token: mockResponse.token,
      user: mockResponse.user_data,
      userType: mockResponse.user_type,
      userId: mockResponse.user.id
    })
  })

  it('should handle login error', async () => {
    const { loginMutation } = useLogin()
    
    await loginMutation.mutate({ 
      email: 'test@example.com', 
      password: 'wrong-password' 
    })
    
    // Verify error toast was shown
    expect(vi.mocked(useToast)().error).toHaveBeenCalled()
  })
}) 