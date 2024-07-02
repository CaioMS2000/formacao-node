import { UniqueId } from "@/core/entities/unique-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Answer as PrismaAnswer, Prisma } from "@prisma/client";

export class PrismaAnswerMapper {
	static toDomain(raw: PrismaAnswer): Answer {
		return Answer.create({
            content: raw.content,
            authorId: new UniqueId(raw.authorId),
            questionId: new UniqueId(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueId(raw.id));
	}

    static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            id: answer.id.toString(),
            content: answer.content,
            authorId: answer.authorId.toString(),
            questionId: answer.questionId.toString(),
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
        }
    }
}
