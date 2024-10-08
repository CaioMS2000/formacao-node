import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	questions: Question[] = [];

	constructor(
		private questionAttachmentRepository: InMemoryQuestionAttachmentsRepository,
		private attachmentsRepository: InMemoryAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository
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
	
	async findDetailsBySlug(slug: string) {
		const question = this.questions.find(
			(question) => question.slug.text === slug
		);

		if(!question) return null;

		const author = this.studentsRepository.students.find(student => student.id.equals(question.authorId));

		if(!author) throw new Error(`Author with id ${question.authorId} not found`);

		const questionAttachments = this.questionAttachmentRepository.attachments.filter(attachment => attachment.questionId.equals(question.id));
		const attachments = questionAttachments.map(questionAttatchment => {
			const attachment = this.attachmentsRepository.attachments.find(attachment => attachment.id.equals(questionAttatchment.attachmentId));

			if(!attachment) throw new Error(`Attachment with id ${questionAttatchment.attachmentId} not found`);

			return attachment;
		})

		return QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			attachments: attachments,
			bestAnswerId: question.bestAnswerId,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});
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
