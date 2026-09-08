import type { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate.js'
import { register } from './register.js'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)
}
