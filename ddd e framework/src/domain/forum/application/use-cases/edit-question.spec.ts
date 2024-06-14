import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueId } from "../../../../core/entities/unique-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let useCase: EditQuestionUseCase;

describe("Edit question", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		useCase = new EditQuestionUseCase(inMemoryQuestionsRepository);
	});

	test("should be able to edit a question", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryQuestionsRepository.questions.push(newQuestion);

		await useCase.execute({
			userId: "author-id",
			title: "título de teste",
			content: "conteudo de teste",
			questionId: "any-id",
		});

		expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
			title: "título de teste",
			content: "conteudo de teste",
		});
	});

	test("should not be able to edit a question from another user", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryQuestionsRepository.questions.push(newQuestion);

		const result = await useCase.execute({
			userId: "author-id-1",
			title: "título de teste",
			content: "conteudo de teste",
			questionId: "any-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
