import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { QuestionAttachmentRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueId } from "@/core/entities/unique-id";

interface EditQuestionUseCaseRequest {
	userId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentRepository: QuestionAttachmentRepository
	) {}

	async execute({
		userId,
		title,
		content,
		questionId,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.toString() !== userId) {
			return left(new NotAllowedError());
		}

		const currentQuestionAttachments =
			await this.questionAttachmentRepository.findManyByQuestionId(
				questionId
			);
		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments
		);
		const questionAttachments = attachmentsIds.map((id) =>
			QuestionAttachment.create({
				attachmentId: new UniqueId(id),
				questionId: question.id,
			})
		);

		questionAttachmentList.update(questionAttachments);

		question.attachments = questionAttachmentList;
		question.title = title;
		question.content = content;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
