import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository.js'

import { CreatePetUseCase } from './create-pet.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to register a new pet', async () => {
    const org = await orgsRepository.create({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      passwordHash: 'hashed-password',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const { pet } = await sut.execute({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      orgId: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should copy the city from the org that registered the pet', async () => {
    const org = await orgsRepository.create({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      passwordHash: 'hashed-password',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const { pet } = await sut.execute({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      orgId: org.id,
    })

    expect(pet.city).toEqual('São Paulo')
  })

  it('should not be able to register a pet for an org that does not exist', async () => {
    await expect(() =>
      sut.execute({
        name: 'Rex',
        about: 'Cão dócil e brincalhão, adora crianças.',
        orgId: 'non-existing-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
