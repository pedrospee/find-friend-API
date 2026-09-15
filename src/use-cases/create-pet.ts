import type { Pet } from '@/prisma-client'
import type { PetsRepository } from '@/repositories/pets-repository.js'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  orgId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    orgId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      orgId,
    })

    return { pet }
  }
}
