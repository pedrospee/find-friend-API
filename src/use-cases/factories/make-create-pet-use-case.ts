import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository.js'

import { CreatePetUseCase } from '../create-pet.js'

export function makeCreatePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const createPetUseCase = new CreatePetUseCase(petsRepository)

  return createPetUseCase
}
