import { QuestionComment, QuestionCommentProps } from "@/domain/entities/question-comment";
import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";
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