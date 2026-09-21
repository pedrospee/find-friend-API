import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { PetAge, PetEnergyLevel, PetSize } from '@/prisma-client'
import { makeFetchPetsByCityUseCase } from '@/use-cases/factories/make-fetch-pets-by-city-use-case.js'

export async function fetchByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchByCityQuerySchema = z.object({
    city: z.string(),
    age: z.nativeEnum(PetAge).optional(),
    size: z.nativeEnum(PetSize).optional(),
    energyLevel: z.nativeEnum(PetEnergyLevel).optional(),
  })

  try {
    const { city, age, size, energyLevel } = fetchByCityQuerySchema.parse(
      request.query,
    )

    const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()

    const { pets } = await fetchPetsByCityUseCase.execute({
      city,
      age,
      size,
      energyLevel,
    })

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
