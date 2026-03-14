import type { LoginBody } from '#shared/types/auth/login/authLogin.type'
import type { ForgotPasswordBody } from '~~/shared/types/auth/forgot-password/forgotPassword.type'
import type { RegisterBody } from '~~/shared/types/auth/register/authRegister.type'
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'
import { ResultAsync } from 'neverthrow'
import { FetchError } from 'ofetch'

interface ApiError {
  message: string
}

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
  }
}

export class AuthService {
  public static login(body: LoginBody): ResultAsync<LoginResponse, ApiError> {
    const res = $fetch('/api/auth/login', {
      method: 'POST',
      body,
    })

    return ResultAsync.fromPromise(
      res,
      (_) => {
        return {
          message: 'Login failed',
        }
      },
    )
  }

  public static logout(): ResultAsync<void, ApiError> {
    const res = $fetch<void>('/api/auth/logout', {
      method: 'POST',
    })

    return ResultAsync.fromPromise(
      res,
      (_e) => {
        return {
          message: 'Logout failed',
        }
      },
    )
  }

  public static register(body: RegisterBody): ResultAsync<LoginResponse, ApiError> {
    const res = $fetch('/api/auth/register', {
      method: 'POST',
      body,
    })

    return ResultAsync.fromPromise(
      res,
      (error) => {
        if (error instanceof FetchError) {
          return {
            message: error.data?.message,
          }
        }

        return {
          message: 'Registration failed',
        }
      },
    )
  }

  public static async forgotPassword(body: ForgotPasswordBody): Promise<void> {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body,
    })
  }

  public static async resetPassword(body: ResetPasswordBody): Promise<void> {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body,
    })
  }
}
