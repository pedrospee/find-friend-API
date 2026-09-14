import type { Pet, Prisma } from '@/prisma-client'

import { prisma } from '@/lib/prisma.js'

import type { PetsRepository } from '../pets-repository.js'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: { id },
    })

    return pet
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
