import { AnswerQuestionUseCase } from "./answer-question";
import { AnswerRepository } from "../repositories/answers-repository";
import { Answer } from '../entities/answer';

const fakeAnswersRepository: AnswerRepository = {
	async create(answer: Answer){return;}
}

test("create an answer", async () => {
	const useCase = new AnswerQuestionUseCase(fakeAnswersRepository);
	const result = await useCase.execute({
		instructorId: "1",
		questionId: "1",
		content: "nova resposta",
	});

	expect(result.content).toEqual("nova resposta");
});
