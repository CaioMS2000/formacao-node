import { UniqueId } from "@/core/entities/unique-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationMapper{
    static toDomain(raw: PrismaNotification): Notification {
        return Notification.create({
            title: raw.title,
            content: raw.content,
            recipientId: new UniqueId(raw.recipientId),
            readAt: raw.readAt,
            createdAt: raw.createdAt,
        }, new UniqueId(raw.id));
    }

    static toPersistence(notification: Notification): Prisma.NotificationUncheckedCreateInput {
        return {
            id: notification.id.toString(),
            recipientId: notification.recipientId.toString(),
            title: notification.title,
            content: notification.content,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
    }
}