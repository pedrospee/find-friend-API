import { randomUUID } from 'node:crypto'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('Authenticate Org (e2e)', () => {
  const email = `e2e-authenticate-org-${randomUUID()}@petcenter.com`

  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })
  })

  afterAll(async () => {
    await prisma.org.deleteMany({ where: { email } })
    await app.close()
  })

  it('should be able to authenticate an org', async () => {
    const response = await request(app.server).post('/sessions').send({
      email,
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with the wrong password', async () => {
    const response = await request(app.server).post('/sessions').send({
      email,
      password: 'wrong-password',
    })

    expect(response.statusCode).toEqual(400)
  })
})
