import { makeAnswer } from "test/factories/make-answer";
import { UniqueId } from "../../../../core/entities/unique-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository;
let useCase: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
	beforeEach(() => {
		inMemoryAnswerCommentRepository =
			new InMemoryAnswerCommentsRepository();
		useCase = new FetchAnswerCommentsUseCase(
			inMemoryAnswerCommentRepository
		);
	});

	test("should be able to fetch answer comments", async () => {
		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueId("1") })
		);
		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueId("1") })
		);
		await inMemoryAnswerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueId("1") })
		);

		const result = await useCase.execute({ page: 1, answerId: "1" });

		expect(result.value.answercomments).toHaveLength(3);
	});

	test("should be able to fetch answer comments with pagination", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentRepository.create(
				makeAnswerComment({ answerId: new UniqueId("1") })
			);
		}

		const result = await useCase.execute({ page: 2, answerId: "1" });

		expect(result.value.answercomments).toHaveLength(2);
	});
});
