import { GymsRepository } from "@/repositories/gyms-repository";
import { SearchGymUseCase } from "./search-gyms";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymUseCase } from "./fetch-nearby-gyms";

let gymsRepository: GymsRepository;
let fetchNearbyGymUseCase: FetchNearbyGymUseCase;

describe("Fetch Nearby Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		fetchNearbyGymUseCase = new FetchNearbyGymUseCase(gymsRepository);
	});

	it("should be able to fetch nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near gym",
			latitude: -16.6782504,
			longitude: -49.233469,
			description: null,
			phone: null,
		});

		await gymsRepository.create({
			title: "Far gym",
			latitude: -16.0222568,
			longitude: -49.7969623,
			description: null,
			phone: null,
		});

		const { gyms } = await fetchNearbyGymUseCase.execute({
			userLatitude: -16.6782504,
			userLongitude: -49.233469,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Near gym" }),
		]);
	});
});
