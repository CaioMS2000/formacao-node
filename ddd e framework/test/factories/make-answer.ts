import { Answer, AnswerProps } from "@/domain/entities/answer";
import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";
import { faker } from "@faker-js/faker";

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueId
) {
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
