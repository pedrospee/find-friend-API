import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository.js'

import { RegisterOrgUseCase } from '../register-org.js'

export function makeRegisterOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const registerOrgUseCase = new RegisterOrgUseCase(orgsRepository)

  return registerOrgUseCase
}
