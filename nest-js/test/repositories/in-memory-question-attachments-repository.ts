import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentRepository
{
	attachments: QuestionAttachment[] = [];

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
