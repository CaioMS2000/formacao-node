import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	attachments: QuestionAttachment[] = [];

	async createMany(attachments: QuestionAttachment[]) {
		this.attachments.push(...attachments);
	}

	async deleteMany(attachments: QuestionAttachment[]) {
		this.attachments = this.attachments.filter(
			(a) => !attachments.some((b) => b.equals(a))
		);
	}

	async findManyByQuestionId(questionId: string) {
		const questionAttachments = this.attachments.filter(
			(a) => a.questionId.toString() === questionId
		);

		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string) {
		const questionAttachments = this.attachments.filter(
			(a) => a.questionId.toString() !== questionId
		);

		this.attachments = questionAttachments;
	}
}
