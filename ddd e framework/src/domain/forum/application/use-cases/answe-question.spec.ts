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
		const {answer} = await useCase.execute({
			instructorId: "1",
			questionId: "1",
			content: "nova resposta",
		});
	
		expect(answer.id).toBeTruthy();
		expect(inMemoryAnswersRepository.answers[0].id).toBe(answer.id);
	});
});
