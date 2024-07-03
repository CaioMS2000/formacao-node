import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	questions: Question[] = [];

	constructor(
		private questionAttachmentRepository: QuestionAttachmentsRepository
	) {}

	async create(question: Question) {
		this.questions.push(question);
		await this.questionAttachmentRepository.createMany(
			question.attachments.getItems()
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question) {
		const index = this.questions.findIndex(
			(q) => q.id.toString() === question.id.toString()
		);

		this.questions[index] = question;
		await this.questionAttachmentRepository.createMany(
			question.attachments.getNewItems()
		);
		await this.questionAttachmentRepository.deleteMany(
			question.attachments.getRemovedItems()
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question) {
		const index = this.questions.findIndex(
			(q) => q.id.toString() === question.id.toString()
		);

		this.questions.splice(index, 1);
		this.questionAttachmentRepository.deleteManyByQuestionId(
			question.id.toString()
		);
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
