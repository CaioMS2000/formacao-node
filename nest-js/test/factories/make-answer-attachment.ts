import { UniqueId } from "@/core/entities/unique-id";
import {
	AnswerAttachment,
	AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class AnswerAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswerAttachment(
		data: Partial<AnswerAttachmentProps> = {},
		id?: UniqueId
	): Promise<AnswerAttachment> {
		const answerAttachment = makeAnswerAttachment(data, id);

		await this.prisma.attachment.update({where:{id: answerAttachment.attachmentId.toString()}, data: {answerId: answerAttachment.answerId.toString()}});

		return answerAttachment
	}
}