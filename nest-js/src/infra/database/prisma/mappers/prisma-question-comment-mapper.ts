import { UniqueId } from "@/core/entities/unique-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Comment as PrismaComment, Prisma } from "@prisma/client";

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
        if(!raw.questionId) throw new Error("QuestionComment must have an questionId");

		return QuestionComment.create({
            content: raw.content,
            authorId: new UniqueId(raw.authorId),
            questionId: new UniqueId(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueId(raw.id));
	}

    static toPersistence(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            content: questionComment.content,
            authorId: questionComment.authorId.toString(),
            questionId: questionComment.questionId.toString(),
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
        }
    }
}
