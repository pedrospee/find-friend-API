import type { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

import { PetAge, PetEnergyLevel, PetSize } from '@/prisma-client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case.js'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.nativeEnum(PetAge),
    size: z.nativeEnum(PetSize),
    energyLevel: z.nativeEnum(PetEnergyLevel),
  })

  try {
    const { name, about, age, size, energyLevel } = createBodySchema.parse(
      request.body,
    )

    const orgId = request.user.sub

    const createPetUseCase = makeCreatePetUseCase()

    await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energyLevel,
      orgId,
    })
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

  return reply.status(201).send()
}
