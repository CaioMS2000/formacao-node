import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueId } from "@/core/entities/unique-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: ChooseQuestionBestAnswerUseCase;

describe("Choose question best answer", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		);
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		useCase = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswerRepository,
			inMemoryQuestionsRepository
		);
	});

	test("should be able to choose question best answer", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueId("author-id"),
		});
		const newAnswer = makeAnswer({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswerRepository.create(newAnswer);

		await useCase.execute({
			answerId: newAnswer.id.toString(),
			userId: "author-id",
		});

		expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toBe(
			newAnswer.id
		);
	});

	test("should not be able to choose question best answer", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueId("author-id"),
		});
		const newAnswer = makeAnswer({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswerRepository.create(newAnswer);

		const result = await useCase.execute({
			answerId: newAnswer.id.toString(),
			userId: "author-id-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
