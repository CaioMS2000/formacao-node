import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentRepository } from "../repositories/answer-attachments-repository";
import { UniqueId } from "@/core/entities/unique-id";

interface EditAnswerUseCaseRequest {
	userId: string;
	answerId: string;
	content: string;
	attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

export class EditAnswerUseCase {
	constructor(private answerRepository: AnswerRepository, private answerAttachmentRepository: AnswerAttachmentRepository) {}

	async execute({
		userId,
		content,
		answerId,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.toString() !== userId) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments =
			await this.answerAttachmentRepository.findManyByAnswerId(
				answerId
			);
		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments
		);
		const answerAttachments = attachmentsIds.map((id) =>
			AnswerAttachment.create({
				attachmentId: new UniqueId(id),
				answerId: answer.id,
			})
		);

		answerAttachmentList.update(answerAttachments);

		answer.attachments = answerAttachmentList;
		answer.content = content;

		await this.answerRepository.save(answer);

		return right({ answer });
	}
}
