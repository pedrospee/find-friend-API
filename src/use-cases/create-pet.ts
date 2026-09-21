import type { Pet, PetAge, PetEnergyLevel, PetSize } from '@/prisma-client'
import type { OrgsRepository } from '@/repositories/orgs-repository.js'
import type { PetsRepository } from '@/repositories/pets-repository.js'

import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: PetAge
  size: PetSize
  energyLevel: PetEnergyLevel
  orgId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energyLevel,
    orgId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energyLevel,
      city: org.city,
      orgId,
    })

    return { pet }
  }
}
