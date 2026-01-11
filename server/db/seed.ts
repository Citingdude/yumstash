import type { RecipeInsert } from './schema/recipe/recipe.schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { PasswordUtil } from '../utils/password/password.util'
import { recipeCategoriesTable } from './schema/recipe-category/recipe-category.schema'
import { recipeDifficultiesTable } from './schema/recipe-difficulty/recipe-difficulty.schema'
import { recipesTable } from './schema/recipe/recipe.schema'
import { usersTable } from './schema/user/user.schema'
import 'dotenv/config'

const db = drizzle(process.env.DATABASE_URL!)

async function seed() {
  try {
    const passwordHash = await PasswordUtil.hash('testing123')

    const [user] = await db
      .insert(usersTable)
      .values({
        name: 'Demo User',
        email: 'demo@yumstash.com',
        passwordHash,
      })
      .returning()

    const categories = [
      { name: 'Breakfast', slug: 'breakfast' },
      { name: 'Lunch', slug: 'lunch' },
      { name: 'Dinner', slug: 'dinner' },
      { name: 'Dessert', slug: 'dessert' },
      { name: 'Snacks', slug: 'snacks' },
      { name: 'Beverages', slug: 'beverages' },
    ]

    const createdCategories = await db
      .insert(recipeCategoriesTable)
      .values(categories)
      .returning()

    const categoryMap = new Map(createdCategories.map(c => [c.slug, c.id]))

    const difficulties = [
      { name: 'easy' as const },
      { name: 'medium' as const },
      { name: 'hard' as const },
    ]

    const createdDifficulties = await db
      .insert(recipeDifficultiesTable)
      .values(difficulties)
      .returning()

    const difficultyMap = new Map(createdDifficulties.map(d => [d.name, d.id]))

    const recipes: RecipeInsert[] = [
      {
        name: 'Fluffy Pancakes',
        description: 'Light and airy pancakes perfect for weekend mornings',
        emoji: '🥞',
        time: '20 min',
        servings: '4',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('breakfast')!,
        authorId: user.id,
      },
      {
        name: 'Classic Margherita Pizza',
        description: 'Traditional Italian pizza with fresh basil and mozzarella',
        emoji: '🍕',
        time: '45 min',
        servings: '2-3',
        difficultyId: difficultyMap.get('medium')!,
        categoryId: categoryMap.get('dinner')!,
        authorId: user.id,
      },
      {
        name: 'Chocolate Chip Cookies',
        description: 'Chewy cookies loaded with chocolate chips',
        emoji: '🍪',
        time: '30 min',
        servings: '24',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('dessert')!,
        authorId: user.id,
      },
      {
        name: 'Thai Green Curry',
        description: 'Aromatic curry with vegetables and coconut milk',
        emoji: '🍛',
        time: '35 min',
        servings: '4',
        difficultyId: difficultyMap.get('medium')!,
        categoryId: categoryMap.get('dinner')!,
        authorId: user.id,
      },
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine with homemade dressing and croutons',
        emoji: '🥗',
        time: '15 min',
        servings: '2',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('lunch')!,
        authorId: user.id,
      },
      {
        name: 'Beef Tacos',
        description: 'Seasoned beef with all your favorite toppings',
        emoji: '🌮',
        time: '25 min',
        servings: '4',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('dinner')!,
        authorId: user.id,
      },
      {
        name: 'Banana Smoothie',
        description: 'Creamy and nutritious breakfast smoothie',
        emoji: '🥤',
        time: '5 min',
        servings: '2',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('beverages')!,
        authorId: user.id,
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon and parmesan',
        emoji: '🍝',
        time: '30 min',
        servings: '4',
        difficultyId: difficultyMap.get('medium')!,
        categoryId: categoryMap.get('dinner')!,
        authorId: user.id,
      },
      {
        name: 'Fresh Fruit Salad',
        description: 'Mix of seasonal fruits with honey lime dressing',
        emoji: '🍉',
        time: '10 min',
        servings: '6',
        difficultyId: difficultyMap.get('easy')!,
        categoryId: categoryMap.get('snacks')!,
        authorId: user.id,
      },
    ]

    await db
      .insert(recipesTable)
      .values(recipes)
      .returning()
  }
  catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
