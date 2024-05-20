import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { describe, beforeEach, test, expect } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		createGymUseCase = new CreateGymUseCase(gymsRepository);
	});

    test("should be able to create gym", async () => {
        const {gym} = await createGymUseCase.execute({
            title: 'Dev gym',
            latitude: -16.6782504,
			longitude: -49.233469,
            description: null,
            phone: null,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
});
