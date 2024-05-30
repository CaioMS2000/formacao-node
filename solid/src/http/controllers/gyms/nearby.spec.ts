import { app } from "@/app";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search nearby gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("should be able to search nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);
		// await gymsRepository.create({
		// 	title: "Near gym",
		// latitude: -16.6782504,
		// longitude: -49.233469,
		// 	description: null,
		// 	phone: null,
		// });

		// await gymsRepository.create({
		// 	title: "Far gym",
		// latitude: -16.0222568,
		// longitude: -49.7969623,
		// 	description: null,
		// 	phone: null,
		// });

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Devs gym #1",
				description: "Some description",
				phone: "9999999999999",
				latitude: -16.6782504,
				longitude: -49.233469,
			});
		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Devs gym #2",
				description: "Some description",
				phone: "9999999999999",
				latitude: -16.0222568,
				longitude: -49.7969623,
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({ latitude: -16.6782504,
				longitude: -49.233469, })
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: "Devs gym #1" }),
		]);
	});
});
