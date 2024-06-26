import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { UniqueId } from "@/core/entities/unique-id";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface CreateQuestionUseCaseRequest {
	content: string;
	title: string;
	authorId: string;
	attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
	null,
	{
		question: Question;
	}
>;

@Injectable()
export class CreateQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		content,
		title,
		authorId,
		attachmentsIds,
	}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			content,
			title,
			authorId: new UniqueId(authorId),
		});
		const questionAttachments = attachmentsIds.map((attachmentId) =>
			QuestionAttachment.create({
				attachmentId: new UniqueId(attachmentId),
				questionId: question.id,
			})
		);

		question.attachments = new QuestionAttachmentList(questionAttachments);

		await this.questionsRepository.create(question);

		return right({ question });
	}
}
