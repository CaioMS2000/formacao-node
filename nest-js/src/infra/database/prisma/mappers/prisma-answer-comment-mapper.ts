import { UniqueId } from "@/core/entities/unique-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Comment as PrismaComment, Prisma } from "@prisma/client";

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaComment): AnswerComment {
        if(!raw.answerId) throw new Error("AnswerComment must have an answerId");

		return AnswerComment.create({
            content: raw.content,
            authorId: new UniqueId(raw.authorId),
            answerId: new UniqueId(raw.answerId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueId(raw.id));
	}

    static toPersistence(answerComment: AnswerComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: answerComment.id.toString(),
            content: answerComment.content,
            authorId: answerComment.authorId.toString(),
            answerId: answerComment.answerId.toString(),
            createdAt: answerComment.createdAt,
            updatedAt: answerComment.updatedAt,
        }
    }
}
