import type { Pet, PetAge, PetEnergyLevel, PetSize } from '@/prisma-client'
import type { PetsRepository } from '@/repositories/pets-repository.js'

interface FetchPetsByCityUseCaseRequest {
  city: string
  age?: PetAge
  size?: PetSize
  energyLevel?: PetEnergyLevel
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energyLevel,
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity(city, {
      age,
      size,
      energyLevel,
    })

    return { pets }
  }
}
