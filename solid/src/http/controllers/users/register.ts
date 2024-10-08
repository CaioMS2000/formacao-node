import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply){    
    try {        
        const registerBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })
        const {name, email, password} = registerBodySchema.parse(request.body)
        const registerUserCase = makeRegisterUseCase()
        const {newUser} = await registerUserCase.execute({name, email, password})
    
        return reply.status(201).send(newUser)
    } catch (error) {

        if(error instanceof UserAlreadyExistsError) return reply.status(409).send({message: error.message});

        throw error
    }
}