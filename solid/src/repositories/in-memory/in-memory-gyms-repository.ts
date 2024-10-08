import { Gym, Prisma } from "@prisma/client";
import { FindManyNearby, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
	public gyms: Gym[] = [];

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id);

		return gym ? gym : null;
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id ?? randomUUID().toString(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			created_at: new Date(),
		};

		this.gyms.push(gym);

		return gym;
	}

	async searchMany(query: string, page: number) {
		return this.gyms
			.filter((gym) => gym.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async findManyNearby({ latitude, longitude }: FindManyNearby) {
		return this.gyms.filter((gym) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude, longitude },
				{
					latitude: gym.latitude.toNumber(),
					longitude: gym.longitude.toNumber(),
				}
			);

			return distance < 10;
		});
	}
}
