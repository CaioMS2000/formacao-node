import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueId } from "@/core/entities/unique-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let useCase: EditQuestionUseCase;

describe("Edit question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		useCase = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository
		);
	});

	test("should be able to edit a question", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryQuestionsRepository.questions.push(newQuestion);
		inMemoryQuestionAttachmentsRepository.attachments.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueId("2"),
			})
		);

		await useCase.execute({
			userId: "author-id",
			title: "título de teste",
			content: "conteudo de teste",
			questionId: "any-id",
			attachmentsIds: ["1", "3"],
		});

		expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
			title: "título de teste",
			content: "conteudo de teste",
		});
		expect(
			inMemoryQuestionsRepository.questions[0].attachments.currentItems
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.questions[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueId("1") }),
			expect.objectContaining({ attachmentId: new UniqueId("3") }),
		]);
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
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	test("should sync new and removed attachments on edition", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryQuestionsRepository.questions.push(newQuestion);
		inMemoryQuestionAttachmentsRepository.attachments.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueId("2"),
			})
		);

		const result = await useCase.execute({
			userId: "author-id",
			title: "título de teste",
			content: "conteudo de teste",
			questionId: "any-id",
			attachmentsIds: ["1", "3"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.attachments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueId("1") }),
				expect.objectContaining({ attachmentId: new UniqueId("3") }),
			])
		);
	});
});
