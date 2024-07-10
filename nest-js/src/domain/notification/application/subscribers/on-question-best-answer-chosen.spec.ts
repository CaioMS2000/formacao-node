import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import {
	SendNotificationUsecase,
	SendNotificationUseCaseRequest,
	SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { makeQuestion } from "test/factories/make-question";
import { SpyInstance, MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let sendNotificationUseCase: SendNotificationUsecase;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
// let sendNotificationExecuteSpy: SpyInstance<[SendNotificationUseRequest], Promise<SendNotificationUseResponse>>;
let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

describe("On question best answer", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);

		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		);

		inMemoryNotificationRepository = new InMemoryNotificationRepository();
		sendNotificationUseCase = new SendNotificationUsecase(
			inMemoryNotificationRepository
		);
		sendNotificationExecuteSpy = vi.spyOn(
			sendNotificationUseCase,
			"execute"
		);

		new OnQuestionBestAnswerChosen(
			inMemoryAnswerRepository,
			sendNotificationUseCase
		);
	});

	it("should send a notification when an answer is selected as best answer", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		inMemoryQuestionRepository.create(question);
		inMemoryAnswerRepository.create(answer);

		question.bestAnswerId = answer.id;

		inMemoryQuestionRepository.save(question);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled();
		});
	});
});
