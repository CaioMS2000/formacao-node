import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerRepository } from "../repositories/answers-repository";
import { AnswerCommentRepository } from "../repositories/answer-comments-repository";
import { UniqueId } from "@/core/entities/unique-id";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment;
	}
>;

@Injectable()
export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswerRepository,
		private answerCommentsRepository: AnswerCommentRepository
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueId(authorId),
			answerId: new UniqueId(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({ answerComment });
	}
}
