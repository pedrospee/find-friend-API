import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case.js'

export async function getDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getDetailsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  try {
    const { id } = getDetailsParamsSchema.parse(request.params)

    const getPetDetailsUseCase = makeGetPetDetailsUseCase()

    const { pet } = await getPetDetailsUseCase.execute({ petId: id })

    return reply.status(200).send({ pet })
  } catch (error) {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
