import { randomUUID } from 'node:crypto'

import type { Pet, Prisma } from '@/prisma-client'

import type { PetsFilters, PetsRepository } from '../pets-repository.js'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    return pet ?? null
  }

  async findManyByCity(city: string, filters: PetsFilters = {}) {
    return this.items.filter((item) => {
      if (item.city !== city) {
        return false
      }

      if (filters.age && item.age !== filters.age) {
        return false
      }

      if (filters.size && item.size !== filters.size) {
        return false
      }

      if (filters.energyLevel && item.energyLevel !== filters.energyLevel) {
        return false
      }

      return true
    })
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      city: data.city,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      orgId: data.orgId,
      createdAt: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}
