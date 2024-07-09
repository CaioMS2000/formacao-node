import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notification-repository";
import { UniqueId } from "@/core/entities/unique-id";
import { Injectable } from "@nestjs/common";

export interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{ notification: Notification }
>;

@Injectable()
export class SendNotificationUsecase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		content,
		title,
		recipientId,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			content,
			title,
			recipientId: new UniqueId(recipientId),
		});

		await this.notificationRepository.create(notification);

		return right({ notification });
	}
}
