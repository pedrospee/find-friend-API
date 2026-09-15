import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository.js'

import { CreatePetUseCase } from './create-pet.js'

let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it('should be able to register a new pet', async () => {
    const { pet } = await sut.execute({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      orgId: 'org-01',
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should link the pet to the org that registered it', async () => {
    const { pet } = await sut.execute({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      orgId: 'org-01',
    })

    expect(pet.orgId).toEqual('org-01')
  })
})
