import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentRepository
{
	attachments: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string) {
		const answerAttachments = this.attachments.filter(
			(a) => a.answerId.toString() === answerId
		);

		return answerAttachments;
	}

	async deleteManyByAnswerId(answerId: string) {
		const answerAttachments = this.attachments.filter(
			(a) => a.answerId.toString() !== answerId
		);

		this.attachments = answerAttachments;
	}
}
