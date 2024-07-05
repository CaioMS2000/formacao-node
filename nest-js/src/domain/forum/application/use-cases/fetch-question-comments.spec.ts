import { makeAnswer } from "test/factories/make-answer";
import { UniqueId } from "@/core/entities/unique-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: FetchQuestionCommentsUseCase;

describe("Fetch question comments", () => {
	beforeEach(() => {
		inMemoryStudentsRepository =
			new InMemoryStudentsRepository();
		inMemoryQuestionCommentRepository =
			new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
		useCase = new FetchQuestionCommentsUseCase(
			inMemoryQuestionCommentRepository
		);
	});

	test("should be able to fetch question comments", async () => {
		const student = makeStudent()

		inMemoryStudentsRepository.students.push(student);

		const comment1 = makeQuestionComment({ questionId: new UniqueId("1"), authorId: student.id })
		const comment2 = makeQuestionComment({ questionId: new UniqueId("1"), authorId: student.id })
		const comment3 = makeQuestionComment({ questionId: new UniqueId("1"), authorId: student.id })

		await inMemoryQuestionCommentRepository.create(comment1);
		await inMemoryQuestionCommentRepository.create(comment2);
		await inMemoryQuestionCommentRepository.create(comment3);

		const result = await useCase.execute({ page: 1, questionId: "1" });

		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(expect.arrayContaining([
			expect.objectContaining({commentId: comment1.id}),
			expect.objectContaining({commentId: comment2.id}),
			expect.objectContaining({commentId: comment3.id}),
		]));
	});

	test("should be able to fetch question comments with pagination", async () => {
		const student = makeStudent()

		inMemoryStudentsRepository.students.push(student);
		
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentRepository.create(
				makeQuestionComment({ questionId: new UniqueId("1"), authorId: student.id })
			);
		}

		const result = await useCase.execute({ page: 2, questionId: "1" });

		expect(result.value?.comments).toHaveLength(2);
	});
});
