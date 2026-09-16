import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository.js'

import { FetchPetsByCityUseCase } from './fetch-pets-by-city.js'

let petsRepository: InMemoryPetsRepository
let sut: FetchPetsByCityUseCase

describe('Fetch Pets By City Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new FetchPetsByCityUseCase(petsRepository)
  })

  it('should be able to fetch pets registered in the given city', async () => {
    await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      orgId: 'org-01',
    })

    await petsRepository.create({
      name: 'Thor',
      about: 'Gato independente, mas carinhoso.',
      city: 'Rio de Janeiro',
      orgId: 'org-02',
    })

    const { pets } = await sut.execute({ city: 'São Paulo' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toEqual('Rex')
  })

  it('should return an empty list when there are no pets in the given city', async () => {
    const { pets } = await sut.execute({ city: 'Curitiba' })

    expect(pets).toHaveLength(0)
  })
})
