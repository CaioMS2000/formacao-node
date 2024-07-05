import { UniqueId } from "@/core/entities/unique-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { User as PrismaUser, Question as PrismaQuestion, Attachment as PrismaAttachment } from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & { author: PrismaUser, attachments: PrismaAttachment[] };

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {

		return QuestionDetails.create({
            authorId: new UniqueId(raw.authorId),
            questionId: new UniqueId(raw.id),
            author: raw.author.name,
            title: raw.title,
            slug: Slug.create(raw.slug),
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId? new UniqueId(raw.bestAnswerId) : null,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
	}
}
