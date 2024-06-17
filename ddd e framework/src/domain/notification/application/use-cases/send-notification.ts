import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";
import { UniqueId } from "@/core/entities/unique-id";

interface SendNotificationUseRequest{
    recipientId: string;
	title: string;
	content: string;
}

type SendNotificationUseResponse = Either<null, {notification: Notification}>

export class SendNotificationUsecase {
    constructor(private notificationRepository: NotificationRepository) {}

    async execute({content, title, recipientId}: SendNotificationUseRequest): Promise<SendNotificationUseResponse> {
        const notification = Notification.create({
            content,
            title,
            recipientId: new UniqueId(recipientId)
        });

        await this.notificationRepository.create(notification);

        return right({notification});
    }
}