import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt.js'

import { create } from './create.js'
import { fetchByCity } from './fetch-by-city.js'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, create)
  app.get('/pets', fetchByCity)
}
