import { randomUUID } from 'node:crypto'

import type { Pet, Prisma } from '@/prisma-client'

import type { PetsRepository } from '../pets-repository.js'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    return pet ?? null
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      orgId: data.orgId,
      createdAt: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}
