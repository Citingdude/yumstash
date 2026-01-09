import type { LoginBody } from '#shared/types/auth/login/authLogin.type'
import type { ForgotPasswordBody } from '~~/shared/types/auth/forgot-password/forgotPassword.type'
import type { RegisterBody } from '~~/shared/types/auth/register/authRegister.type'
import type { ResetPasswordBody } from '~~/shared/types/auth/reset-password/resetPassword.type'

export class AuthService {
  public static async login(body: LoginBody) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body,
    })
  }

  public static async logout(): Promise<void> {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
  }

  public static async register(body: RegisterBody): Promise<void> {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body,
    })
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
