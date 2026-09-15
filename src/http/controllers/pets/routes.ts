import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt.js'

import { create } from './create.js'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, create)
}
