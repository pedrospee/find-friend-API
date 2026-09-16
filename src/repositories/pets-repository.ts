import type { Pet, Prisma } from '@/prisma-client'

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByCity(city: string): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
