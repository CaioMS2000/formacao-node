import { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";
import { checkSessionId } from "../middlewares/check-session-id";

export async function transactionsRoutes(app: FastifyInstance) {
	// base path: transactions

	app.get("/", { preHandler: [checkSessionId] }, async (request, reply) => {
		const sessionId = request.cookies.sessionId;
		const transactions = await knex("transactions")
			.where("session_id", sessionId)
			.select();

		return { transactions };
	});

	app.get(
		"/summary",
		{ preHandler: [checkSessionId] },
		async (request, reply) => {
			const sessionId = request.cookies.sessionId;
			const summary = await knex("transactions")
				.where({ session_id: sessionId })
				.sum("amount", { as: "amount" })
				.first();

			return { summary };
		}
	);

	app.get(
		"/:id",
		{ preHandler: [checkSessionId] },
		async (request, reply) => {
			const sessionId = request.cookies.sessionId;
			const getTransactionParamsSchema = z.object({
				id: z.string().uuid(),
			});
			const params = getTransactionParamsSchema.parse(request.params);
			const { id } = params;
			const transaction = await knex("transactions")
				.where({ id, session_id: sessionId })
				.first();

			return { transaction };
		}
	);

	app.post("/", async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});

		const body = createTransactionBodySchema.parse(request.body);
		const { amount, title, type } = body;

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();

			reply.cookie("sessionId", sessionId, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
			});
		}

		const transaction = await knex("transactions")
			.insert({
				id: randomUUID(),
				title,
				amount: type === "credit" ? amount : amount * -1,
				session_id: sessionId,
			})
			.returning("*");

		return reply.status(201).send(transaction);
		return transaction;
	});
}
