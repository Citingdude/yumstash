import type { UserSelect } from '~~/server/db/schema/index'
import type { User } from '~~/shared/types/user/user.type'

export class UserTransformer {
  public static fromDatabase(dbUser: UserSelect): User {
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
    }
  }
}
