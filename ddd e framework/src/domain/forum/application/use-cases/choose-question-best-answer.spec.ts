import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueId } from "../../../../core/entities/unique-id";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let useCase: ChooseQuestionBestAnswerUseCase;

describe("Choose question best answer", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		inMemoryAnswerRepository = new InMemoryAnswerRepository();
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
