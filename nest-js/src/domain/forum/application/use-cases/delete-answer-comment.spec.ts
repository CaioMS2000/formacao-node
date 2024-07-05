import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: DeleteAnswerCommentUseCase;

describe("Comment on answer", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository =
			new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
		useCase = new DeleteAnswerCommentUseCase(
			inMemoryAnswerCommentsRepository
		);
	});

	it("should be able to delete answer comment", async () => {
		const answerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(answerComment);
		await useCase.execute({
			authorId: answerComment.authorId.toString(),
			answerCommentId: answerComment.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.answerComments).toEqual([]);
	});

	it("should not be able to delete answer comment", async () => {
		const answerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await useCase.execute({
			authorId: "wrog-id",
			answerCommentId: answerComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
