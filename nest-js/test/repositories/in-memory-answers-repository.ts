import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryAnswerRepository implements AnswersRepository {
	answers: Answer[] = [];

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) {}

	async create(answer: Answer) {
		this.answers.push(answer);

		await this.answerAttachmentsRepository.createMany(answer.attachments.getItems())

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async delete(answer: Answer) {
		const index = this.answers.findIndex(
			(a) => a.id.toString() === answer.id.toString()
		);

		this.answers.splice(index, 1);
		this.answerAttachmentsRepository.deleteManyByAnswerId(
			answer.id.toString()
		);
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

		await this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems())
		await this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems())
		
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const answers = this.answers
			.filter((answer) => answer.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);

		return answers;
	}
}
