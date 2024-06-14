import {
	AnswerComment,
	AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { UniqueId } from "@/core/entities/unique-id";
import { faker } from "@faker-js/faker";

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
