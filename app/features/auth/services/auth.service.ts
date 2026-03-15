import type { LoginBody } from '#shared/types/auth/login/authLogin.type'
import type { ForgotPasswordBody } from '~~/shared/types/auth/forgot-password/forgotPassword.type'
import type { RegisterBody } from '~~/shared/types/auth/register/authRegister.type'
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'
import type { AuthError } from '~/features/auth/models/error/AuthError.model'
import type { AuthForgotPasswordResponse } from '~/features/auth/models/forgot-password/AuthForgotPasswordResponse.model'
import type { AuthLoginResponse } from '~/features/auth/models/login/loginResponse.model'
import type { AuthRegisterResponse } from '~/features/auth/models/register/registerResponse.model'
import type { AuthResetPasswordResponse } from '~/features/auth/models/reset-password/AuthResetPassword.model'
import { ResultAsync } from 'neverthrow'
import { FetchError } from 'ofetch'

export class AuthService {
  public static login(body: LoginBody): ResultAsync<AuthLoginResponse, AuthError> {
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

  public static logout(): ResultAsync<void, AuthError> {
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

  public static register(body: RegisterBody): ResultAsync<AuthRegisterResponse, AuthError> {
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

  public static forgotPassword(
    body: ForgotPasswordBody,
  ): ResultAsync<AuthForgotPasswordResponse, AuthError> {
    const req = $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body,
    })

    return ResultAsync.fromPromise(
      req,
      () => {
        return {
          message: 'If an account exists with that email, a password reset link has been sent.',
        }
      },
    )
  }

  public static resetPassword(
    body: ResetPasswordBody,
  ): ResultAsync<AuthResetPasswordResponse, AuthError> {
    const req = $fetch('/api/auth/reset-password', {
      method: 'POST',
      body,
    })

    return ResultAsync.fromPromise(
      req,
      () => {
        return {
          message: 'Reset password failed',
        }
      },
    )
  }
}
