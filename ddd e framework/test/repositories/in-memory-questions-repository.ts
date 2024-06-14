import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	questions: Question[] = [];

	async create(question: Question) {
		this.questions.push(question);
	}

	async save(question: Question) {
		const index = this.questions.findIndex(
			(q) => q.id.toString() === question.id.toString()
		);

		this.questions[index] = question;
	}

	async delete(question: Question) {
		const index = this.questions.findIndex(
			(q) => q.id.toString() === question.id.toString()
		);

		this.questions.splice(index, 1);
	}

	async findBySlug(slug: string) {
		const question = this.questions.find(
			(question) => question.slug.text === slug
		);

		return question ?? null;
	}

	async findById(id: string) {
		const question = this.questions.find(
			(question) => question.id.toString() === id
		);

		return question ?? null;
	}

	async findManyRecent(params: PaginationParams) {
		const questions = this.questions
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((params.page - 1) * 20, params.page * 20);

		return questions;
	}
}
