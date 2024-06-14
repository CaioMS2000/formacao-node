import { QuestionComment } from "@/domain/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { Either, right } from "@/core/either";

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

export class FetchQuestionCommentsUseCase {
	constructor(
		private questioncommentsRepository: QuestionCommentRepository
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
