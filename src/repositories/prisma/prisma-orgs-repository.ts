import type { Org, Prisma } from '@/prisma-client'

import { prisma } from '@/lib/prisma.js'

import type { OrgsRepository } from '../orgs-repository.js'

export class PrismaOrgsRepository implements OrgsRepository {
  async findById(id: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { id },
    })

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { email },
    })

    return org
  }

  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = await prisma.org.create({
      data,
    })

    return org
  }
}
