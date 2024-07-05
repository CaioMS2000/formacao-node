import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface FetchQuestionCommentsUseCaseRequest {
	page: number;
	questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
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
		const comments =
			await this.questioncommentsRepository.findManyByQuestionIdWithAuthor(
				questionId,
				{ page }
			);

		return right({ comments });
	}
}
