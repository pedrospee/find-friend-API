import { randomUUID } from 'node:crypto'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('Fetch Pets By City (e2e)', () => {
  const email = `e2e-fetch-pets-by-city-${randomUUID()}@petcenter.com`
  const city = `São Paulo ${randomUUID()}`
  const filtersEmail = `e2e-fetch-pets-by-city-filters-${randomUUID()}@petcenter.com`
  const filtersCity = `São Paulo ${randomUUID()}`

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.pet.deleteMany({ where: { org: { email } } })
    await prisma.org.deleteMany({ where: { email } })
    await prisma.pet.deleteMany({ where: { org: { email: filtersEmail } } })
    await prisma.org.deleteMany({ where: { email: filtersEmail } })
    await app.close()
  })

  it('should be able to fetch pets registered in the given city', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city,
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

    const response = await request(app.server)
      .get('/pets')
      .query({ city })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0].name).toEqual('Rex')
  })

  it('should not be able to fetch pets without informing a city', async () => {
    const response = await request(app.server).get('/pets')

    expect(response.statusCode).toEqual(400)
  })

  it('should be able to filter pets by characteristics within a city', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email: filtersEmail,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: filtersCity,
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: filtersEmail,
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

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mia',
        about: 'Gata tranquila, ideal para apartamento.',
        age: 'FILHOTE',
        size: 'PEQUENO',
        energyLevel: 'BAIXA',
      })

    const response = await request(app.server)
      .get('/pets')
      .query({ city: filtersCity, size: 'PEQUENO' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0].name).toEqual('Mia')
  })
})
