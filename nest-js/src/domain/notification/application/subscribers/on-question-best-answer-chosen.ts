import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUsecase } from "../use-cases/send-notification";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answerRepository: AnswersRepository,
		private sendNotification: SendNotificationUsecase
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name
		);
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent) {
		const answer = await this.answerRepository.findById(
			bestAnswerId.toString()
		);

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer.authorId.toString(),
				title: `Your answer was marked as best answer`,
				content: `Your answer on the question "${question.title
					.substring(0, 20)
					.concat("...")}" was marked as best answer`,
			});
		}
	}
}
