import { UniqueId } from "@/core/entities/unique-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAttachment): AnswerAttachment {
        if(!raw.answerId) throw new Error("AnswerAttachment must have an answerId");

		return AnswerAttachment.create({
            attachmentId: new UniqueId(raw.id),
            answerId: new UniqueId(raw.answerId),
        }, new UniqueId(raw.id));
	}
}
