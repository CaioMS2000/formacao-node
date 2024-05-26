import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe("Validate check-in use case", () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInRepository()
		validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to validate the check-in", async () => {
		const newCheckIn = await checkInRepository.create({
			gym_id: '1',
			user_id: '1'
		})

		const {checkIn} = await validateCheckInUseCase.execute({checkInId: newCheckIn.id})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
	})

	it("should not be able to validate check-in that does not exist", async () => {
		await expect(() => validateCheckInUseCase.execute({checkInId: "non-existent check-in"})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it("should not be able to validate check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2024, 0, 1, 12, 40))

		const newCheckIn = await checkInRepository.create({
			gym_id: '1',
			user_id: '1'
		})

		const _21minInMs = 1000 * 60 * 21

		vi.advanceTimersByTime(_21minInMs)

		await expect(() => validateCheckInUseCase.execute({checkInId: newCheckIn.id})).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})