import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(request: FastifyRequest, reply: FastifyReply){
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })
    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value => Math.abs(value) <= 90),
        longitude: z.number().refine(value => Math.abs(value) <= 180),
    })
    const {latitude, longitude} = createCheckInBodySchema.parse(request.body)
    const {gymId} = createCheckInParamsSchema.parse(request.params)
    const useCase = makeCheckInUseCase()
    const {checkIn} = await useCase.execute({userLatitude: latitude, userLongitude: longitude, gymId, userId: request.user.sub})

    return reply.status(201).send({checkIn,})
}