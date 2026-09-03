import { hash } from 'bcryptjs'

import type { Org } from '@/prisma-client'
import type { OrgsRepository } from '@/repositories/orgs-repository.js'

import { OrgAlreadyExistsError } from './errors/org-already-exists-error.js'

interface RegisterOrgUseCaseRequest {
  name: string
  email: string
  password: string
  whatsapp: string
  address: string
  city: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    whatsapp,
    address,
    city,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      passwordHash,
      whatsapp,
      address,
      city,
    })

    return { org }
  }
}
