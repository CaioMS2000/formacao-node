import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	questionComments: QuestionComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async create(questionComment: QuestionComment) {
		this.questionComments.push(questionComment);
	}

	async delete(questionComment: QuestionComment) {
		this.questionComments = this.questionComments.filter(
			(comment) => comment.id.toString() !== questionComment.id.toString()
		);
	}

	async findById(id: string) {
		const questionComment = this.questionComments.find(
			(comment) => comment.id.toString() === id
		);

		return questionComment ?? null;
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const questionComments = this.questionComments
			.filter(
				(questionComment) =>
					questionComment.questionId.toString() === questionId
			)
			.slice((params.page - 1) * 20, params.page * 20);

		return questionComments;
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams
	) {
		const questionComments = this.questionComments
			.filter(
				(questionComment) =>
					questionComment.questionId.toString() === questionId
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

		return questionComments;
	}
}
