import {
	AnswerComment,
	AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueId
) {
	const newAnswerComment = AnswerComment.create(
		{
			content: faker.lorem.text(),
			authorId: new UniqueId(),
			answerId: new UniqueId(),
			...override,
		},
		id
	);

	return newAnswerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answerComment),
    })

    return answerComment
  }
}