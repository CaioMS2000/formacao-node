import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueId } from "../../../../core/entities/unique-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let useCase: DeleteQuestionUseCase;

describe("Delete question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		useCase = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});

	test("should be able to delete a question", async () => {
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

		await useCase.execute({ questionId: "any-id", userId: "author-id" });

		expect(inMemoryQuestionsRepository.questions).toHaveLength(0);
		expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(0);
	});

	test("should not be able to delete a question from another user", async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueId("author-id") },
			new UniqueId("any-id")
		);

		inMemoryQuestionsRepository.questions.push(newQuestion);

		const result = await useCase.execute({
			questionId: "any-id",
			userId: "author-id-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
