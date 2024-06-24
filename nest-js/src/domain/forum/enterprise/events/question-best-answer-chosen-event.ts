import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";
import { UniqueId } from "@/core/entities/unique-id";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
	ocurredAt: Date;
	question: Question;
	bestAnswerId: UniqueId;

	constructor(question: Question, bestAnswerId: UniqueId) {
		this.ocurredAt = new Date();
		this.question = question;
		this.bestAnswerId = bestAnswerId;
	}

	getAggregateId() {
		return this.question.id;
	}
}
