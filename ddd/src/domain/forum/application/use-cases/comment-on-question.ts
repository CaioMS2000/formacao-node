import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionCommentRepository } from "../repositories/question-comments-repository";
import { UniqueId } from "@/core/entities/unique-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment;
	}
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentRepository
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueId(authorId),
			questionId: new UniqueId(questionId),
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({ questionComment });
	}
}
