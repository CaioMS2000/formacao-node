import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface FetchQuestionCommentsUseCaseRequest {
	page: number;
	questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questioncomments: QuestionComment[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(
		private questioncommentsRepository: QuestionCommentsRepository
	) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questioncomments =
			await this.questioncommentsRepository.findManyByQuestionId(
				questionId,
				{ page }
			);

		return right({ questioncomments });
	}
}
