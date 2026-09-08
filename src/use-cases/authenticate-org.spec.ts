import bcryptjs from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js'

import { AuthenticateOrgUseCase } from './authenticate-org.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

describe('Authenticate Org Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)

    await orgsRepository.create({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      passwordHash: await bcryptjs.hash('123456', 6),
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })
  })

  it('should be able to authenticate an org', async () => {
    const { org } = await sut.execute({
      email: 'contact@petcenter.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with a non-existing email', async () => {
    await expect(() =>
      sut.execute({
        email: 'unknown@petcenter.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with the wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'contact@petcenter.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
