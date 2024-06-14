import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "@/domain/entities/answer";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";

export class InMemoryAnswerRepository implements AnswerRepository {
	answers: Answer[] = [];

	async create(answer: Answer) {
		this.answers.push(answer);
	}

	async delete(answer: Answer) {
		const index = this.answers.findIndex(
			(a) => a.id.toString() === answer.id.toString()
		);

		this.answers.splice(index, 1);
	}

	async findById(id: string) {
		const answer = this.answers.find(
			(answer) => answer.id.toString() === id
		);

		return answer ?? null;
	}

	async save(answer: Answer) {
		const index = this.answers.findIndex(
			(a) => a.id.toString() === answer.id.toString()
		);

		this.answers[index] = answer;
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const answers = this.answers.filter(
			(answer) => answer.questionId.toString() === questionId
		).slice(
			(params.page - 1) * 20,
			params.page * 20
		);

		return answers;
	}
}
