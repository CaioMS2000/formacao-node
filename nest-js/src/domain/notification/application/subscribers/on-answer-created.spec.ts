import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
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

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sendNotificationUseCase: SendNotificationUsecase;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
// let sendNotificationExecuteSpy: SpyInstance<[SendNotificationUseRequest], Promise<SendNotificationUseResponse>>;
let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationUseCaseRequest],
	Promise<SendNotificationUseCaseResponse>
>;

describe("On answer created", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswerRepository(
			inMemoryAnswerAttachmentRepository
		);
		inMemoryNotificationRepository = new InMemoryNotificationRepository();
		sendNotificationUseCase = new SendNotificationUsecase(
			inMemoryNotificationRepository
		);
		sendNotificationExecuteSpy = vi.spyOn(
			sendNotificationUseCase,
			"execute"
		);

		new OnAnswerCreated(
			inMemoryQuestionRepository,
			sendNotificationUseCase
		);
	});

	it("should send a notification when an answer is created", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		inMemoryQuestionRepository.create(question);
		inMemoryAnswerRepository.create(answer);

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
	});
});
