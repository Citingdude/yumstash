export class UserTransformer {
  fromDatabase(dbUser: UserSelect): User {
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
    }
  }
}
