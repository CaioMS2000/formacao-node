import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueId } from "../../enterprise/entities/unique-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswersRepository: InMemoryAnswerRepository
let useCase: EditAnswerUseCase

describe("Edit answer", () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswerRepository();
        useCase = new EditAnswerUseCase(inMemoryAnswersRepository);
    });

    test("should be able to edit a answer", async () => {
        const newAnswer = makeAnswer({authorId: new UniqueId("author-id")}, new UniqueId("any-id"));

        inMemoryAnswersRepository.answers.push(newAnswer);

        await useCase.execute({userId: "author-id", content: "conteudo de teste", answerId: "any-id"});
    
        expect(inMemoryAnswersRepository.answers[0]).toMatchObject({content: "conteudo de teste"})
    });

    test("should not be able to edit a answer from another user", async () => {
        const newAnswer = makeAnswer({authorId: new UniqueId("author-id")}, new UniqueId("any-id"));

        inMemoryAnswersRepository.answers.push(newAnswer);
    
        const result = await useCase.execute({userId: "author-id-1", content: "conteudo de teste", answerId: "any-id"})

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError)
    });
})
