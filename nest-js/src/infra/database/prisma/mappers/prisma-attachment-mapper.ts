import { UniqueId } from "@/core/entities/unique-id";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAttachmentMapper{
    static toPersistence(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        };
    }

    static toDomain(attachment: PrismaAttachment): Attachment {
        return Attachment.create({
            title: attachment.title,
            url: attachment.url,
        }, new UniqueId(attachment.id));
    }
}