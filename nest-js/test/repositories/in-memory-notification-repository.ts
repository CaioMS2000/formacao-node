import { NotificationsRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationsRepository {
	notifications: Notification[] = [];

	async create(notification: Notification) {
		this.notifications.push(notification);
	}

	async save(notification: Notification): Promise<void> {
		const index = this.notifications.findIndex(
			(n) => n.id == notification.id
		);

		this.notifications[index] = notification;
	}

	async findById(id: string) {
		const notification = this.notifications.find(
			(n) => n.id.toString() == id
		);

		return notification ?? null;
	}
}
