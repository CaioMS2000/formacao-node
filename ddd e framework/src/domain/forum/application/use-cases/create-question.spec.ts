import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let useCase: CreateQuestionUseCase

describe("Create question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
        useCase = new CreateQuestionUseCase(inMemoryQuestionsRepository);
    });

    test("should be able to create a question", async () => {
        const {question} = await useCase.execute({content: "any content", title: "Nova pergunta", authorId: "1"});
    
        expect(question.id).toBeTruthy()
        expect(inMemoryQuestionsRepository.questions[0].id).toBe(question.id);
    });
})
