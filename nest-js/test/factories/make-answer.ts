import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueId) {
	const newAnswer = Answer.create(
		{
			content: faker.lorem.text(),
			authorId: new UniqueId(),
			questionId: new UniqueId(),
			...override,
		},
		id
	);

	return newAnswer;
}

@Injectable()
export class AnswerFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const Answer = makeAnswer(data);

		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPersistence(Answer),
		});

		return Answer;
	}
}
