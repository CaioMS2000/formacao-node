import { makeAnswer } from "test/factories/make-answer";
import { UniqueId } from "@/core/entities/unique-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let useCase: FetchQuestionCommentsUseCase;

describe("Fetch question comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentRepository =
			new InMemoryQuestionCommentsRepository();
		useCase = new FetchQuestionCommentsUseCase(
			inMemoryQuestionCommentRepository
		);
	});

	test("should be able to fetch question comments", async () => {
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueId("1") })
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueId("1") })
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueId("1") })
		);

		const result = await useCase.execute({ page: 1, questionId: "1" });

		expect(result.value.questioncomments).toHaveLength(3);
	});

	test("should be able to fetch question comments with pagination", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentRepository.create(
				makeQuestionComment({ questionId: new UniqueId("1") })
			);
		}

		const result = await useCase.execute({ page: 2, questionId: "1" });

		expect(result.value.questioncomments).toHaveLength(2);
	});
});
