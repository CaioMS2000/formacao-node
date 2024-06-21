import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let useCase: FetchRecentQuestionsUseCase

describe("Fetch recent questions", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
        useCase = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
    });

    test("should be able to fetch recent questions", async () => {
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2021, 1, 1)}));
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2021, 1, 5)}));
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2021, 1, 10)}));

        const result = await useCase.execute({page: 1});

        expect(result.value.questions).toEqual([
            expect.objectContaining({createdAt: new Date(2021, 1, 10)}),
            expect.objectContaining({createdAt: new Date(2021, 1, 5)}),
            expect.objectContaining({createdAt: new Date(2021, 1, 1)}),
        ]);
    });

    test("should be able to fetch recent questions with pagination", async () => {
        for(let i = 1; i<= 22; i++){
            await inMemoryQuestionsRepository.create(makeQuestion());
        }

        const result = await useCase.execute({page: 2});

        expect(result.value.questions).toHaveLength(2)
    });
})
