import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: DeleteQuestionCommentUseCase;

describe("Comment on question", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
		useCase = new DeleteQuestionCommentUseCase(
			inMemoryQuestionCommentsRepository
		);
	});

	it("should be able to delete question comment", async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionCommentsRepository.create(questionComment);
		await useCase.execute({
			authorId: questionComment.authorId.toString(),
			questionCommentId: questionComment.id.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.questionComments).toEqual([]);
	});

	it("should not be able to delete question comment", async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await useCase.execute({
			authorId: "wrog-id",
			questionCommentId: questionComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
