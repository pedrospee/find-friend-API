import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository.js'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository.js'

import { CreatePetUseCase } from '../create-pet.js'

export function makeCreatePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository)

  return createPetUseCase
}
