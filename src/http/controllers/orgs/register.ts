import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error.js'
import { makeRegisterOrgUseCase } from '@/use-cases/factories/make-register-org-use-case.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    whatsapp: z.string(),
    address: z.string(),
    city: z.string(),
  })

  try {
    const { name, email, password, whatsapp, address, city } =
      registerBodySchema.parse(request.body)

    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
      name,
      email,
      password,
      whatsapp,
      address,
      city,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
