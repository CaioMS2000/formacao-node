import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: GetQuestionBySlugUseCase;

describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =	new InMemoryQuestionAttachmentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		);
		useCase = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	test("should be able to get a question by slug", async () => {
		const student = makeStudent({ name: "John" });

		inMemoryStudentsRepository.students.push(student);

		const newQuestion = makeQuestion({
			slug: Slug.create("any-slug"),
			authorId: student.id,
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const attachment = makeAttachment({ title: "any-title" });

		inMemoryAttachmentsRepository.attachments.push(attachment);
		inMemoryQuestionAttachmentsRepository.attachments.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			})
		);

		const result = await useCase.execute({ slug: "any-slug" });

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: student.name,
				attachments: expect.arrayContaining([
					expect.objectContaining({
						title: attachment.title,
					}),
				]),
			}),
		});
	});
});
