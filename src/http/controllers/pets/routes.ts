import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt.js'

import { create } from './create.js'
import { fetchByCity } from './fetch-by-city.js'
import { getDetails } from './get-details.js'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, create)
  app.get('/pets', fetchByCity)
  app.get('/pets/:id', getDetails)
}
