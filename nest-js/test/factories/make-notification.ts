
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";

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
