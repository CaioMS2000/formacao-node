import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface ReadNotificationUseRequest {
	recipientId: string;
	notificationId: string;
}

type ReadNotificationUseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{ notification: Notification }
>;

@Injectable()
export class ReadNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		notificationId,
		recipientId,
	}: ReadNotificationUseRequest): Promise<ReadNotificationUseResponse> {
		const notification = await this.notificationRepository.findById(
			notificationId
		);

		if (!notification) {
			return left(new ResourceNotFoundError());
		}

		if (recipientId !== notification.recipientId.toString()) {
			return left(new NotAllowedError());
		}

		notification.read();
		await this.notificationRepository.create(notification);

		return right({ notification });
	}
}
