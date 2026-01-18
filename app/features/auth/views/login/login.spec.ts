import { expect, test } from '@nuxt/test-utils/playwright'

test('shows login failed toast with invalid credentials', async ({ page, goto }) => {
  await goto('/login', { waitUntil: 'hydration' })

  await page.getByLabel('Email address').fill('invalid@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'sign in' }).click()

  const toast = await page.waitForSelector('[role=alert]', {
    timeout: 3000,
  })

  const toastText = await toast.textContent()

  expect(toastText).toContain('Login failed')

  await goto('/', {
    waitUntil: 'hydration',
  })

  await expect(page).toHaveURL('/login')
})

test('login form submits and redirects', async ({ page, goto }) => {
  await goto('/login', {
    waitUntil: 'hydration',
  })

  const email = process.env.TEST_LOGIN_EMAIL as string
  const password = process.env.TEST_LOGIN_PASSWORD as string

  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'sign in' }).click()

  await expect(page).toHaveURL('/')
})
