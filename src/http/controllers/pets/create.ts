import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case.js'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
  })

  try {
    const { name, about } = createBodySchema.parse(request.body)

    const orgId = request.user.sub

    const createPetUseCase = makeCreatePetUseCase()

    await createPetUseCase.execute({
      name,
      about,
      orgId,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    throw error
  }

  return reply.status(201).send()
}
