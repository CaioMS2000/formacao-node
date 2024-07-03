import { UniqueId } from "@/core/entities/unique-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
	static toDomain(raw: PrismaAttachment): QuestionAttachment {
        if(!raw.questionId) throw new Error("QuestionAttachment must have an questionId");

		return QuestionAttachment.create({
            attachmentId: new UniqueId(raw.id),
            questionId: new UniqueId(raw.questionId),
        }, new UniqueId(raw.id));
	}

    static toPrismaUpdateMany(
        attachments: QuestionAttachment[],
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
            questionId: attachments[0].questionId.toString(),
          },
        }
      }
}
