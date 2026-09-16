import type { Pet } from '@/prisma-client'
import type { PetsRepository } from '@/repositories/pets-repository.js'

interface FetchPetsByCityUseCaseRequest {
  city: string
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity(city)

    return { pets }
  }
}
