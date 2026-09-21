import { randomUUID } from 'node:crypto'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('Get Pet Details (e2e)', () => {
  const email = `e2e-get-pet-details-${randomUUID()}@petcenter.com`

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.pet.deleteMany({ where: { org: { email } } })
    await prisma.org.deleteMany({ where: { email } })
    await app.close()
  })

  it('should be able to get the details of a pet', async () => {
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

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        about: 'Cão dócil e brincalhão, adora crianças.',
        age: 'ADULTO',
        size: 'MEDIO',
        energyLevel: 'ALTA',
      })

    const registeredPet = await prisma.pet.findFirstOrThrow({
      where: { org: { email } },
    })

    const response = await request(app.server).get(
      `/pets/${registeredPet.id}`,
    )

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet.name).toEqual('Rex')
    expect(response.body.orgWhatsapp).toEqual('11999999999')
  })

  it('should return 404 when the pet does not exist', async () => {
    const response = await request(app.server).get(
      `/pets/${randomUUID()}`,
    )

    expect(response.statusCode).toEqual(404)
  })
})
