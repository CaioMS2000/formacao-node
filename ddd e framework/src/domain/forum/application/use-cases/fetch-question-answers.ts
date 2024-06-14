import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchQuestionAnswersUseCaseRequest {
	page: number;
	questionId: string;
}

type FetchQuestionAnswersUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answers: Answer[];
	}
>;

export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswerRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{ page }
		);

		if (!answers) {
			return left(new ResourceNotFoundError());
		}

		return right({ answers });
	}
}
