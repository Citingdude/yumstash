import type { ForgotPasswordBody } from '~~/shared/types/auth/forgot-password/forgotPassword.type'
import type { LoginBody } from '~~/shared/types/auth/login/authLogin.type'
import type { RegisterBody } from '~~/shared/types/auth/register/authRegister.type'
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'

const fetchMock = vi.fn()

globalThis.$fetch = Object.assign(fetchMock, {
  raw: vi.fn(),
  create: vi.fn(),
})

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call login with the correct parameters', async () => {
    const body: LoginBody = {
      email: 'test@example.com',
      password: 'password123',
      remember: false,
    }

    await AuthService.login(body)

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body,
    })
  })

  it('should call logout with the correct parameters', async () => {
    await AuthService.logout()

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    })
  })

  it('should call register with the correct parameters', async () => {
    const body: RegisterBody = {
      email: 'new@example.com',
      password: 'password123',
      name: 'user',
    }

    await AuthService.register(body)

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      body,
    })
  })

  it('should call forgotPassword with the correct parameters', async () => {
    const body: ForgotPasswordBody = {
      email: 'recover@example.com',
    }

    await AuthService.forgotPassword(body)

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
      method: 'POST',
      body,
    })
  })

  it('should call resetPassword with the correct parameters', async () => {
    const body: ResetPasswordBody = {
      token: 'abc-123',
      password: 'new-password',
      confirmPassword: 'new-password',
    }

    await AuthService.resetPassword(body)

    expect(globalThis.$fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
      method: 'POST',
      body,
    })
  })

  it('should throw an error if the fetch fails', async () => {
    vi
      .mocked(globalThis.$fetch)
      .mockRejectedValueOnce(new Error('API Error'))

    await expect(AuthService.logout()).rejects.toThrow('API Error')
  })
})
