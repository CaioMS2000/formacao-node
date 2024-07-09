
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueId
) {
	const newNotification = Notification.create(
		{
			content: faker.lorem.sentence(),
			title: faker.lorem.sentence(),
			recipientId: new UniqueId(),
			...override,
		},
		id
	);

	return newNotification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    })

    return notification
  }
}