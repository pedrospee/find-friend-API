import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository.js'

import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { GetPetDetailsUseCase } from './get-pet-details.js'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetPetDetailsUseCase(petsRepository, orgsRepository)
  })

  it('should be able to get the details of a pet', async () => {
    const org = await orgsRepository.create({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      passwordHash: 'hashed-password',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const createdPet = await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: org.id,
    })

    const { pet } = await sut.execute({ petId: createdPet.id })

    expect(pet.id).toEqual(createdPet.id)
    expect(pet.name).toEqual('Rex')
  })

  it('should return the WhatsApp number of the org responsible for the pet', async () => {
    const org = await orgsRepository.create({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      passwordHash: 'hashed-password',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const createdPet = await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: org.id,
    })

    const { orgWhatsapp } = await sut.execute({ petId: createdPet.id })

    expect(orgWhatsapp).toEqual('11999999999')
  })

  it('should not be able to get details of a pet that does not exist', async () => {
    await expect(() =>
      sut.execute({ petId: 'non-existing-pet-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
