import {
	QuestionComment,
	QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";

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
