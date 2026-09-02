import { expect, test } from 'vitest'

import { InMemoryOrgsRepository } from './in-memory-orgs-repository.js'

test('creates an org and finds it by email', async () => {
  const orgsRepository = new InMemoryOrgsRepository()

  await orgsRepository.create({
    name: 'Pet Center',
    email: 'contact@petcenter.com',
    passwordHash: 'hashed-password',
    whatsapp: '11999999999',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
  })

  const org = await orgsRepository.findByEmail('contact@petcenter.com')

  expect(org).not.toBeNull()
  expect(org?.name).toBe('Pet Center')
})
