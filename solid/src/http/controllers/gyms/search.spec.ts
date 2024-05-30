import { app } from "@/app";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("should be able to search gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);

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
				latitude: -16.6782504,
				longitude: -49.233469,
			});

		const response = await request(app.server)
			.get("/gyms/search")
			.query({ q: "#1" })
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([expect.objectContaining({title: "Devs gym #1"})])
	});
});
