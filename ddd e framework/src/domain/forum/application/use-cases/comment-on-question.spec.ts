import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { makeQuestion } from "test/factories/make-question";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let useCase: CommentOnQuestionUseCase;

describe("Comment on question", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		useCase = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository
		);
	});

	it("should be able to comment on a question", async () => {
		const question = makeQuestion()

		await inMemoryQuestionsRepository.create(question);
        await useCase.execute({authorId: question.authorId.toString(), questionId: question.id.toString(), content: "test comment"})

        expect(inMemoryQuestionCommentsRepository.questionComments[0].content).toEqual("test comment")
	});
});
