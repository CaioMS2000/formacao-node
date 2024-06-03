import { app } from "@/app";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("should be able to create a gym", async () => {
		const { token } = await createAndAuthenticateUser(app, true);
		const response = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Devs gym",
                description: "Some description",
                phone: "9999999999999",
				latitude: -16.6782504,
				longitude: -49.233469,
			});

		expect(response.statusCode).toEqual(201);
	});
});
