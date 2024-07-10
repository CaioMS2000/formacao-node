import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: CommentOnAnswerUseCase;

describe("Comment on answer", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository
		);
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		);
		useCase = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository
		);
	});

	it("should be able to comment on a answer", async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);
		await useCase.execute({
			authorId: answer.authorId.toString(),
			answerId: answer.id.toString(),
			content: "test comment",
		});

		expect(
			inMemoryAnswerCommentsRepository.answerComments[0].content
		).toEqual("test comment");
	});
});
