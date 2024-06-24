import { Either, left, right } from "@/core/either";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteQuestionUseCaseRequest {
	questionId: string;
	userId: string;
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		questionId,
		userId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.toString() !== userId) {
			return left(new NotAllowedError());
		}

		await this.questionsRepository.delete(question);

		return right(null);
	}
}
