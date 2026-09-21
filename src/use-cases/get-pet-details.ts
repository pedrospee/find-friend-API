import type { Pet } from '@/prisma-client'
import type { PetsRepository } from '@/repositories/pets-repository.js'

import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
  pet: Pet
}

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return { pet }
  }
}
