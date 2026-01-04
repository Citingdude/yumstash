import type { LoginBody } from '#shared/types/auth/login/authLogin.type'
import type { RegisterBody } from '~~/shared/types/auth/register/authRegister.type'

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
}
