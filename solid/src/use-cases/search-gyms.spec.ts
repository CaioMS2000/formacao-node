import { GymsRepository } from "@/repositories/gyms-repository";
import { SearchGymUseCase } from "./search-gyms";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository;
let searchGymUseCase: SearchGymUseCase;

describe("Search Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		searchGymUseCase = new SearchGymUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "Back-end Devs gym",
			latitude: -16.6782504,
			longitude: -49.233469,
			description: null,
			phone: null,
		});

		await gymsRepository.create({
			title: "Front-end Devs gym",
			latitude: -16.6782504,
			longitude: -49.233469,
			description: null,
			phone: null,
		});

		const { gyms } = await searchGymUseCase.execute({
			query: "Front-end",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Front-end Devs gym" }),
		]);
	});

	it("should be able to make a paginated search for gyms", async () => {
		for (let index = 1; index < 23; index++) {
			await gymsRepository.create({
				title: `Devs gym n#${index}`,
				latitude: -16.6782504,
				longitude: -49.233469,
				description: null,
				phone: null,
			});
		}

		const { gyms } = await searchGymUseCase.execute({
			query: "Devs",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Devs gym n#21" }),
			expect.objectContaining({ title: "Devs gym n#22" }),
		]);
	});
});
