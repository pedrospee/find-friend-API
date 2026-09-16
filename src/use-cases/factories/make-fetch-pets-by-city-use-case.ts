import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository.js'

import { FetchPetsByCityUseCase } from '../fetch-pets-by-city.js'

export function makeFetchPetsByCityUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const fetchPetsByCityUseCase = new FetchPetsByCityUseCase(petsRepository)

  return fetchPetsByCityUseCase
}
