import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { env } from './env/index.js'
import { orgsRoutes } from './http/controllers/orgs/routes.js'
import { petsRoutes } from './http/controllers/pets/routes.js'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(orgsRoutes)
app.register(petsRoutes)
