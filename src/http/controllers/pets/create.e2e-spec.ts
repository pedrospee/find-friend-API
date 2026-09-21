import { randomUUID } from 'node:crypto'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('Create Pet (e2e)', () => {
  const email = `e2e-create-pet-${randomUUID()}@petcenter.com`
  const deletedOrgEmail = `e2e-create-pet-deleted-org-${randomUUID()}@petcenter.com`

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.pet.deleteMany({ where: { org: { email } } })
    await prisma.org.deleteMany({ where: { email } })
    await app.close()
  })

  it('should be able to register a new pet', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email,
      password: '123456',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        about: 'Cão dócil e brincalhão, adora crianças.',
        age: 'ADULTO',
        size: 'MEDIO',
        energyLevel: 'ALTA',
      })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to register a pet without authentication', async () => {
    const response = await request(app.server).post('/pets').send({
      name: 'Rex',
      about: 'Cão dócil e brincalhão, adora crianças.',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should return 404 when the org from the token no longer exists', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email: deletedOrgEmail,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: deletedOrgEmail,
      password: '123456',
    })

    const { token } = authResponse.body

    await prisma.org.deleteMany({ where: { email: deletedOrgEmail } })

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        about: 'Cão dócil e brincalhão, adora crianças.',
        age: 'ADULTO',
        size: 'MEDIO',
        energyLevel: 'ALTA',
      })

    expect(response.statusCode).toEqual(404)
  })
})
