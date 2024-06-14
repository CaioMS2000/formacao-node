import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/entities/answer-comment";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments-repository";

export class InMemoryAnswerCommentsRepository implements AnswerCommentRepository {
    answerComments: AnswerComment[] = [];

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

        return answerComment?? null;
    }

    async findManyByAnswerId(answerId: string, params: PaginationParams) {
		const answerComments = this.answerComments.filter(
			(answerComment) => answerComment.answerId.toString() === answerId
		).slice(
			(params.page - 1) * 20,
			params.page * 20
		);

		return answerComments;
	}
}