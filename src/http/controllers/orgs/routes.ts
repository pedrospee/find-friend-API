import type { FastifyInstance } from 'fastify'

import { register } from './register.js'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
}
