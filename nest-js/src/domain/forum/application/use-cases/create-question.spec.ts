import { UniqueId } from "@/core/entities/unique-id";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: CreateQuestionUseCase;

describe("Create question", () => {
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
		useCase = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	test("should be able to create a question", async () => {
		const result = await useCase.execute({
			content: "any content",
			title: "Nova pergunta",
			authorId: "1",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionsRepository.questions[0]).toEqual(
			result.value?.question
		);
		expect(
			inMemoryQuestionsRepository.questions[0].attachments.currentItems
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.questions[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueId("1") }),
			expect.objectContaining({ attachmentId: new UniqueId("2") }),
		]);
	});

	test("should be able to create a question and persist it's attachments", async () => {
		const result = await useCase.execute({
			content: "any content",
			title: "Nova pergunta",
			authorId: "1",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionAttachmentsRepository.attachments).toHaveLength(2);
		expect(inMemoryQuestionAttachmentsRepository.attachments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueId("1") }),
				expect.objectContaining({ attachmentId: new UniqueId("2") }),
			])
		);
	});
});
