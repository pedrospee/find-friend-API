import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository.js'

import { GetPetDetailsUseCase } from '../get-pet-details.js'

export function makeGetPetDetailsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const getPetDetailsUseCase = new GetPetDetailsUseCase(petsRepository)

  return getPetDetailsUseCase
}
