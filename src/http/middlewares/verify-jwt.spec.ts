import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { verifyJwt } from './verify-jwt.js'

describe('Verify JWT Middleware', () => {
  const app = fastify()

  beforeAll(async () => {
    app.register(fastifyJwt, { secret: 'test-secret' })
    app.get('/test-route', { onRequest: [verifyJwt] }, async () => {
      return { ok: true }
    })

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not allow a request without a token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test-route',
    })

    expect(response.statusCode).toEqual(401)
  })

  it('should allow a request with a valid token', async () => {
    const token = app.jwt.sign({ sub: 'org-id' })

    const response = await app.inject({
      method: 'GET',
      url: '/test-route',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toEqual(200)
  })
})
