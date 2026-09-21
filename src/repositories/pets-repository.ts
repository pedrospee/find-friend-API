import type { Pet, PetAge, PetEnergyLevel, PetSize, Prisma } from '@/prisma-client'

export interface PetsFilters {
  age?: PetAge
  size?: PetSize
  energyLevel?: PetEnergyLevel
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByCity(city: string, filters?: PetsFilters): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
