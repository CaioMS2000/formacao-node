import { AnswerComment } from "@/domain/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { Either, right } from "@/core/either";

interface FetchAnswerCommentsUseCaseRequest {
	page: number;
	answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		answercomments: AnswerComment[];
	}
>;

export class FetchAnswerCommentsUseCase {
	constructor(private answercommentsRepository: AnswerCommentRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answercomments =
			await this.answercommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({ answercomments });
	}
}
