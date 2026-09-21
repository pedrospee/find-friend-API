import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository.js'

import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { GetPetDetailsUseCase } from './get-pet-details.js'

let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('should be able to get the details of a pet', async () => {
    const createdPet = await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: 'org-01',
    })

    const { pet } = await sut.execute({ petId: createdPet.id })

    expect(pet.id).toEqual(createdPet.id)
    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to get details of a pet that does not exist', async () => {
    await expect(() =>
      sut.execute({ petId: 'non-existing-pet-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
