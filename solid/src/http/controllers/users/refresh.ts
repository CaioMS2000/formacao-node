import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify({ onlyCookie: true });

		const token = await reply.jwtSign(
			{},
			{ sign: { sub: request.user.sub } }
		);
		const refreshToken = await reply.jwtSign(
			{},
			{ sign: { sub: request.user.sub, expiresIn: "7d" } }
		);

		return reply
			.setCookie("refreshToken", refreshToken, {
				path: "/",
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({ token });
	} catch (error) {
		if (error instanceof InvalidCredentialsError)
			return reply.status(400).send({ message: error.message });

		throw error;
	}
}
