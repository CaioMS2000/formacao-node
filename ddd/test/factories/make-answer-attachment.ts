import { UniqueId } from "@/core/entities/unique-id";
import {
	AnswerAttachment,
	AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
	overrides: Partial<AnswerAttachmentProps> = {},
	id?: UniqueId
) {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueId(),
			attachmentId: new UniqueId(),
			...overrides,
		},
		id
	);

    return answerAttachment;
}
