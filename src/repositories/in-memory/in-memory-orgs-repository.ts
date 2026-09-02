import { randomUUID } from 'node:crypto'

import type { Org, Prisma } from '@/prisma-client'

import type { OrgsRepository } from '../orgs-repository.js'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    return org ?? null
  }

  async create(data: Prisma.OrgCreateInput) {
    const org: Org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      createdAt: new Date(),
    }

    this.items.push(org)

    return org
  }
}
