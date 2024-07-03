import { UniqueId } from "@/core/entities/unique-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface AnswerQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		authorId: instructorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueId(instructorId),
			questionId: new UniqueId(questionId),
		});
		const answerAttachments = attachmentsIds.map((attachmentId) =>
			AnswerAttachment.create({
				attachmentId: new UniqueId(attachmentId),
				answerId: answer.id,
			})
		);

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
