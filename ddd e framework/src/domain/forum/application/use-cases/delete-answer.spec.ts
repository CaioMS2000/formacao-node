import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueId } from "../../../../core/entities/unique-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let useCase: DeleteAnswerUseCase;

describe("Delete answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswerRepository(inMemoryAnswerAttachmentsRepository);
		useCase = new DeleteAnswerUseCase(inMemoryAnswerRepository);
	});

	test("should be able to delete a answer", async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryAnswerRepository.create(newAnswer);
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

		await useCase.execute({ answerId: "any-id", userId: "author-id" });

		expect(inMemoryAnswerRepository.answers).toHaveLength(0);
		expect(inMemoryAnswerAttachmentsRepository.attachments).toHaveLength(0);
	});

	test("should not be able to delete a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryAnswerRepository.answers.push(newAnswer);

		const result = await useCase.execute({
			answerId: "any-id",
			userId: "author-id-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
