import {
	QuestionComment,
	QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueId
) {
	const newQuestionComment = QuestionComment.create(
		{
			content: faker.lorem.text(),
			authorId: new UniqueId(),
			questionId: new UniqueId(),
			...override,
		},
		id
	);

	return newQuestionComment;
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionComment(
		data: Partial<QuestionCommentProps> = {}
	): Promise<QuestionComment> {
		const questionComment = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPersistence(questionComment),
		});

		return questionComment;
	}
}
