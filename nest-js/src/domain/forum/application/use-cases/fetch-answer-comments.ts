import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

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

@Injectable()
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
