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
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: 'org-01',
    })

    await petsRepository.create({
      name: 'Thor',
      about: 'Gato independente, mas carinhoso.',
      city: 'Rio de Janeiro',
      age: 'ADULTO',
      size: 'PEQUENO',
      energyLevel: 'BAIXA',
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

  it('should be able to filter pets by characteristics within a city', async () => {
    await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: 'org-01',
    })

    await petsRepository.create({
      name: 'Mia',
      about: 'Gata tranquila, ideal para apartamento.',
      city: 'São Paulo',
      age: 'FILHOTE',
      size: 'PEQUENO',
      energyLevel: 'BAIXA',
      orgId: 'org-01',
    })

    const { pets } = await sut.execute({ city: 'São Paulo', size: 'PEQUENO' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toEqual('Mia')
  })

  it('should return an empty list when no pet matches the given characteristics', async () => {
    await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
      city: 'São Paulo',
      age: 'ADULTO',
      size: 'MEDIO',
      energyLevel: 'ALTA',
      orgId: 'org-01',
    })

    const { pets } = await sut.execute({ city: 'São Paulo', age: 'IDOSO' })

    expect(pets).toHaveLength(0)
  })
})
