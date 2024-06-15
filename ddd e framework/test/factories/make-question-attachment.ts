import { UniqueId } from "@/core/entities/unique-id";
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
	overrides: Partial<QuestionAttachmentProps> = {},
	id?: UniqueId
) {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueId(),
			attachmentId: new UniqueId(),
			...overrides,
		},
		id
	);

    return questionAttachment;
}
