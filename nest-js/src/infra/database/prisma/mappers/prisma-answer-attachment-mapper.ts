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

    static toPrismaUpdateMany(
        attachments: AnswerAttachment[],
      ): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map((attachment) => {
          return attachment.attachmentId.toString()
        })
    
        return {
          where: {
            id: {
              in: attachmentIds,
            },
          },
          data: {
            answerId: attachments[0].answerId.toString(),
          },
        }
      }
}
