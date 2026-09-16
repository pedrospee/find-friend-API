import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { makeFetchPetsByCityUseCase } from '@/use-cases/factories/make-fetch-pets-by-city-use-case.js'

export async function fetchByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchByCityQuerySchema = z.object({
    city: z.string(),
  })

  try {
    const { city } = fetchByCityQuerySchema.parse(request.query)

    const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()

    const { pets } = await fetchPetsByCityUseCase.execute({ city })

    return reply.status(200).send({ pets })
  } catch (error) {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    throw error
  }
}
