import { app } from "@/app";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Check-in history (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("should be able to get check-in history", async () => {
		const { token } = await createAndAuthenticateUser(app);
		const user = await prisma.user.findFirstOrThrow();
		const gym = await prisma.gym.create({
			data: {
				title: "Devs gym",
				description: "Some description",
				phone: "9999999999999",
				latitude: -16.6782504,
				longitude: -49.233469,
			},
		});
		
        await prisma.checkIn.createMany({
			data: [
                { gym_id: gym.id, user_id: user.id },
                { gym_id: gym.id, user_id: user.id },
            ],
		});
		
        const response = await request(app.server)
			.get(`/check-ins/history`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -16.6782504,
				longitude: -49.233469,
			});

		expect(response.statusCode).toEqual(200);
		expect(response.body.checkIns).toEqual([
            expect.objectContaining({ gym_id: gym.id, user_id: user.id },),
            expect.objectContaining(                { gym_id: gym.id, user_id: user.id },)
        ]);
	});
});
