import fastify from "fastify";
import { z, ZodError } from "zod";
import { usersRoutes } from "./http/controllers/users/routes";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: { expiresIn: "10m" },
});
app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, request, reply) => {
	if (error instanceof ZodError)
		return reply
			.status(400)
			.send({ message: "Validation error", issues: error.format() });

	if (env.NODE_ENV != "production") {
		console.error(error);
	}

	return reply.status(500).send({ message: "Internal server error" });
});
