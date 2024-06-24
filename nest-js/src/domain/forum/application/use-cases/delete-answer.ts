import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	userId: string;
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswerRepository) {}

	async execute({
		answerId,
		userId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.toString() !== userId) {
			return left(new NotAllowedError());
		}

		await this.answersRepository.delete(answer);
		return right(null);
	}
}
