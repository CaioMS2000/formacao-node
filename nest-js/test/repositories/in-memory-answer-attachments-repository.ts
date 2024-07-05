import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
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

	async createMany(attachments: AnswerAttachment[]) {
		this.attachments.push(...attachments);
	}

	async deleteMany(attachments: AnswerAttachment[]) {
		this.attachments = this.attachments.filter(
			(a) => !attachments.some((b) => b.equals(a))
		);
	}
}
