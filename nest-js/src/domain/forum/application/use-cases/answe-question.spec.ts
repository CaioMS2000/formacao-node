import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { UniqueId } from "@/core/entities/unique-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswerRepository;
let useCase: AnswerQuestionUseCase;

describe("Create answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswerRepository(
			inMemoryAnswerAttachmentsRepository
		);
		useCase = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	test("should be able to  create an answer", async () => {
		const result = await useCase.execute({
			authorId: "1",
			questionId: "1",
			content: "nova resposta",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.answers[0]).toBe(result.value?.answer);
		expect(
			inMemoryAnswersRepository.answers[0].attachments.currentItems
		).toHaveLength(2);
		expect(
			inMemoryAnswersRepository.answers[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueId("1") }),
			expect.objectContaining({ attachmentId: new UniqueId("2") }),
		]);
	});

	test("should be able to create an answer and persist it's attachments", async () => {
		const result = await useCase.execute({
			content: "any content",
			questionId: "1",
			authorId: "1",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.attachments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueId("1") }),
				expect.objectContaining({ attachmentId: new UniqueId("2") }),
			])
		);
	});
});
