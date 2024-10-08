import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}

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
