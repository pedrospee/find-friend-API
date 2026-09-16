import { expect, test } from 'vitest'

import { InMemoryPetsRepository } from './in-memory-pets-repository.js'

test('creates a pet and finds it by id', async () => {
  const petsRepository = new InMemoryPetsRepository()

  const createdPet = await petsRepository.create({
    name: 'Rex',
    about: 'Cão dócil e brincalhão, adora crianças.',
    city: 'São Paulo',
    orgId: 'org-01',
  })

  const pet = await petsRepository.findById(createdPet.id)

  expect(pet).not.toBeNull()
  expect(pet?.name).toBe('Rex')
})
