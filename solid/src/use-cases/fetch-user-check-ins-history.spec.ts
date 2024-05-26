import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: CheckInsRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe("Fetch check-in history Use Case", () => {
	beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
		fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
	});

	afterEach(() => {
	});

	test("should be able to fetch check-in history", async () => {
        await checkInsRepository.create({
            gym_id: '1',
            user_id: '1'
        })
        await checkInsRepository.create({
            gym_id: '2',
            user_id: '1'
        })
		const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
			userId: "1",
            page: 1
		});

		expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: '1'}),
            expect.objectContaining({gym_id: '2'})
        ])
	});

	test("should be able to fetch paginated check-in history", async () => {
        for (let index = 1; index <= 22; index++) {            
            await checkInsRepository.create({
                gym_id: `${index}`,
                user_id: '1'
            })
        }

		const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
			userId: "1",
            page: 2
		});

		expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: '21'}),
            expect.objectContaining({gym_id: '22'})
        ])
	});
});
