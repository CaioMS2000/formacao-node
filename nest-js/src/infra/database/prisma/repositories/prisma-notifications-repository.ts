import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notification-repository";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(notification: Notification) {
		const data = PrismaNotificationMapper.toPersistence(notification);

		await this.prisma.notification.create({ data });
	}

	async save(notification: Notification) {
		const data = PrismaNotificationMapper.toPersistence(notification);

		await this.prisma.notification.update({ where: { id: data.id }, data });
	}

	async findById(id: string) {
		const notification = await this.prisma.notification.findUnique({
			where: {
				id,
			},
		});

		if (!notification) return null;

		return PrismaNotificationMapper.toDomain(notification);
	}
}
