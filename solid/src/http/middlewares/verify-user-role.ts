import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(_role: "ADMIN"|"MEMBER"){
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const {role} = request.user
        
        if (role != _role) return reply.status(401).send({message: 'Unauthorized'});
    }
}