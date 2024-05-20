import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./max-distance-error";
import { MaxNumberOfCheckInsError } from "./max-number-of-check-ins-error";

let checkInsRepository: CheckInsRepository;
let checkInUseCase: CheckInUseCase;
let gymsRepository: InMemoryGymsRepository;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInRepository();
		gymsRepository = new InMemoryGymsRepository()
		checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

		// gymsRepository.gyms.push()
		await gymsRepository.create({
			id: '1',
			title: 'Devs Gym',
			description: '',
			phone: '',
			latitude: -16.6782504,
			longitude: -49.2334694
		})

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("should be able to check in", async () => {
		const { checkIn } = await checkInUseCase.execute({
			gymId: "1",
			userId: "1",
			userLatitude: -16.6782504,
			userLongitude: -49.233469
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	test("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await checkInUseCase.execute({
			gymId: "1",
			userId: "1",
			userLatitude: -16.6782504,
			userLongitude: -49.233469
		});

		await expect(() =>
			checkInUseCase.execute({
				gymId: "1",
				userId: "1",
				userLatitude: -16.6782504,
			userLongitude: -49.233469
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	test("should be able to check in twice in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await checkInUseCase.execute({
			gymId: "1",
			userId: "1",
			userLatitude: -16.6782504,
			userLongitude: -49.233469
		});

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await checkInUseCase.execute({
			gymId: "1",
			userId: "1",
			userLatitude: -16.6782504,
			userLongitude: -49.233469
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	test("should not be able to check on distant gym", async () => {
		gymsRepository.gyms.push({
			id: '2',
			title: 'Devs Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-16.6178391),
			longitude: new Decimal(-49.2069099)
		})

		await expect(() => checkInUseCase.execute({
			gymId: "2",
			userId: "1",
			userLatitude: -16.6782504,
			userLongitude: -49.2334694
		})).rejects.toBeInstanceOf(MaxDistanceError)
	});
});
