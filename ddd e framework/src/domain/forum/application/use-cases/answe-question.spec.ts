import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let useCase: AnswerQuestionUseCase;

describe("Create answer", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswerRepository();
		useCase = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	test("should be able to  create an answer", async () => {
		const result = await useCase.execute({
			instructorId: "1",
			questionId: "1",
			content: "nova resposta",
		});
	
		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.answers[0]).toBe(result.value.answer);
	});
});
