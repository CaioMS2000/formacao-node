import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	questionComments: QuestionComment[] = [];

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
}
