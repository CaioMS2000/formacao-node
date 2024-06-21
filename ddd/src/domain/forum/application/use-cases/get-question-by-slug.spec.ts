import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let useCase: GetQuestionBySlugUseCase;

describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		useCase = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	test("should be able to get a question by slug", async () => {
		const newQuestion = makeQuestion({ slug: Slug.create("any-slug") });

		inMemoryQuestionsRepository.questions.push(newQuestion);

		const result = await useCase.execute({ slug: "any-slug" });

		expect(result.value.question.id).toBeTruthy();
		expect(result.value.question.title).toEqual(newQuestion.title);
	});
});
