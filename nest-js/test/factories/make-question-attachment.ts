import { UniqueId } from "@/core/entities/unique-id";
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionAttachment(
		data: Partial<QuestionAttachmentProps> = {},
		id?: UniqueId
	): Promise<QuestionAttachment> {
		const questionAttachment = makeQuestionAttachment(data, id);

		await this.prisma.attachment.update({
			where: { id: questionAttachment.attachmentId.toString() },
			data: { questionId: questionAttachment.questionId.toString() },
		});

		return questionAttachment;
	}
}
