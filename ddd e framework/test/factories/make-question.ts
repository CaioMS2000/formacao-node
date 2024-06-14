import { Question, QuestionProps } from "@/domain/entities/question";
import { Slug } from "@/domain/entities/value-objects/slug";
import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";
import { faker } from "@faker-js/faker";

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueId
) {
	const newQuestion = Question.create(
		{
			content: faker.lorem.text(),
			title: faker.lorem.sentence(),
			authorId: new UniqueId(),
			slug: Slug.create("any-slug"),
			...override,
		},
		id
	);

	return newQuestion;
}
