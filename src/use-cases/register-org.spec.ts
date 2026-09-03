import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js'

import { OrgAlreadyExistsError } from './errors/org-already-exists-error.js'
import { RegisterOrgUseCase } from './register-org.js'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a new org', async () => {
    const { org } = await sut.execute({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash the org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'Pet Center',
      email: 'contact@petcenter.com',
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      org.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register an org with an email that is already in use', async () => {
    const email = 'contact@petcenter.com'

    await sut.execute({
      name: 'Pet Center',
      email,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    await expect(() =>
      sut.execute({
        name: 'Another Pet Center',
        email,
        password: '123456',
        whatsapp: '11988888888',
        address: 'Avenida Central, 456',
        city: 'Rio de Janeiro',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
