import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueId } from "@/core/entities/unique-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: DeleteQuestionUseCase;

describe("Delete question", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
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
		expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(
			0
		);
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
