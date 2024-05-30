import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply){

    const getUserProfile = makeGetUserProfileUseCase()
    const {user: _user} = await getUserProfile.execute({
        userId: request.user.sub
    })
    // const user = _user as Partial<typeof _user>

    // delete user.password_hash
    const user = {..._user, password_hash: undefined}

    return reply.status(200).send({user})
}