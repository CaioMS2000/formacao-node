import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: CheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe("Fetch check-in history Use Case", () => {
	beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
		getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);
	});

	afterEach(() => {
	});

	test("should be able to get user metrics", async () => {
        await checkInsRepository.create({
            gym_id: '1',
            user_id: '1'
        })
        await checkInsRepository.create({
            gym_id: '2',
            user_id: '1'
        })
		const { checkInsCount } = await getUserMetricsUseCase.execute({
			userId: "1",
		});

		expect(checkInsCount).toEqual(2)
	});
});
