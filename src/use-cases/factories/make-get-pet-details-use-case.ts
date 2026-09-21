import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository.js'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository.js'

import { GetPetDetailsUseCase } from '../get-pet-details.js'

export function makeGetPetDetailsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const getPetDetailsUseCase = new GetPetDetailsUseCase(
    petsRepository,
    orgsRepository,
  )

  return getPetDetailsUseCase
}
