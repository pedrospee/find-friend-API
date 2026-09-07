import { randomUUID } from 'node:crypto'

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('Register Org (e2e)', () => {
  const email = `e2e-register-org-${randomUUID()}@petcenter.com`

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.org.deleteMany({ where: { email } })
    await app.close()
  })

  it('should be able to register a new org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'Pet Center',
      email,
      password: '123456',
      whatsapp: '11999999999',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
    })

    expect(response.statusCode).toEqual(201)
  })
})
