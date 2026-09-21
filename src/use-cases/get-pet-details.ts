import type { Pet } from '@/prisma-client'
import type { OrgsRepository } from '@/repositories/orgs-repository.js'
import type { PetsRepository } from '@/repositories/pets-repository.js'

import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
  pet: Pet
  orgWhatsapp: string
}

export class GetPetDetailsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const org = await this.orgsRepository.findById(pet.orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return { pet, orgWhatsapp: org.whatsapp }
  }
}
