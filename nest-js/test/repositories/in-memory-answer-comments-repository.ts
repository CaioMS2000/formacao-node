import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	answerComments: AnswerComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async create(answerComment: AnswerComment) {
		this.answerComments.push(answerComment);
	}

	async delete(answerComment: AnswerComment) {
		this.answerComments = this.answerComments.filter(
			(comment) => comment.id.toString() !== answerComment.id.toString()
		);
	}

	async findById(id: string) {
		const answerComment = this.answerComments.find(
			(comment) => comment.id.toString() === id
		);

		return answerComment ?? null;
	}

	async findManyByAnswerId(answerId: string, params: PaginationParams) {
		const answerComments = this.answerComments
			.filter(
				(answerComment) =>
					answerComment.answerId.toString() === answerId
			)
			.slice((params.page - 1) * 20, params.page * 20);

		return answerComments;
	}

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams
	) {
		const answerComments = this.answerComments
			.filter(
				(answerComment) =>
					answerComment.answerId.toString() === answerId
			)
			.slice((params.page - 1) * 20, params.page * 20)
			.map((comment) => {
				const author = this.studentsRepository.students.find(student => student.id.equals(comment.authorId))

				if(!author) throw new Error(`Author with id ${comment.authorId.toString()} not found`)

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				})
			});

		return answerComments;
	}
}
