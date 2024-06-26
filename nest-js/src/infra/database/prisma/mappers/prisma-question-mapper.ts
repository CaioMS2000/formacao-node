import { UniqueId } from "@/core/entities/unique-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion, Prisma } from "@prisma/client";

export class PrismaQuestionMapper {
	static toDomain(raw: PrismaQuestion): Question {
		return Question.create({
            title: raw.title,
            content: raw.content,
            authorId: new UniqueId(raw.authorId),
            bestAnswerId: raw.bestAnswerId? new UniqueId(raw.bestAnswerId):null,
            slug: Slug.create(raw.slug),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueId(raw.id));
	}

    static toPersistence(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            title: question.title,
            content: question.content,
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            slug: question.slug.text,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}
