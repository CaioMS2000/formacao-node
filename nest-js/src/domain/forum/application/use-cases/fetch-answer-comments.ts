import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface FetchAnswerCommentsUseCaseRequest {
	page: number;
	answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answercommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments =
			await this.answercommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
				page,
			});

		return right({ comments });
	}
}
