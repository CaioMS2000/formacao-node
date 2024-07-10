import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueId } from "@/core/entities/unique-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let useCase: EditAnswerUseCase;

describe("Edit answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		useCase = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository
		);
	});

	test("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryAnswersRepository.answers.push(newAnswer);
		inMemoryAnswerAttachmentsRepository.attachments.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueId("1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueId("2"),
			})
		);

		await useCase.execute({
			userId: "author-id",
			content: "conteudo de teste",
			answerId: "any-id",
			attachmentsIds: ["1", "3"],
		});

		expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
			content: "conteudo de teste",
		});
		expect(
			inMemoryAnswersRepository.answers[0].attachments.currentItems
		).toHaveLength(2);
		expect(
			inMemoryAnswersRepository.answers[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueId("1") }),
			expect.objectContaining({ attachmentId: new UniqueId("3") }),
		]);
	});

	test("should not be able to edit a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryAnswersRepository.answers.push(newAnswer);

		const result = await useCase.execute({
			userId: "author-id-1",
			content: "conteudo de teste",
			answerId: "any-id",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	test("should sync new and removed attachments on edition", async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryAnswersRepository.create(newAnswer);
		inMemoryAnswerAttachmentsRepository.attachments.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueId("1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueId("2"),
			})
		);

		const result = await useCase.execute({
			userId: "author-id",
			content: "conteudo de teste",
			answerId: newAnswer.id.toString(),
			attachmentsIds: ["1", "3"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.attachments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueId("1") }),
				expect.objectContaining({ attachmentId: new UniqueId("3") }),
			])
		);
	});
});
