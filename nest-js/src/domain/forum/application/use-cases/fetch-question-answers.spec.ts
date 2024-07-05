import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueId } from "@/core/entities/unique-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let useCase: FetchQuestionAnswersUseCase;

describe("Fetch question answers", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswerRepository(
			inMemoryAnswerAttachmentsRepository
		);
		useCase = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
	});

	test("should be able to fetch question answers", async () => {
		await inMemoryAnswerRepository.create(
			makeAnswer({ questionId: new UniqueId("1") })
		);
		await inMemoryAnswerRepository.create(
			makeAnswer({ questionId: new UniqueId("1") })
		);
		await inMemoryAnswerRepository.create(
			makeAnswer({ questionId: new UniqueId("1") })
		);

		const result = await useCase.execute({ page: 1, questionId: "1" });
		
		expect(result.value.answers).toHaveLength(3);
	});

	test("should be able to fetch question answers with pagination", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerRepository.create(
				makeAnswer({ questionId: new UniqueId("1") })
			);
		}

		const result = await useCase.execute({ page: 2, questionId: "1" });

		expect(result.value.answers).toHaveLength(2);
	});
});
