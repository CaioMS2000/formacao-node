import { UniqueId } from "@/core/entities/unique-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let useCase: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
	beforeEach(() => {
		inMemoryStudentsRepository =
			new InMemoryStudentsRepository();
		inMemoryAnswerCommentRepository =
			new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
		useCase = new FetchAnswerCommentsUseCase(
			inMemoryAnswerCommentRepository
		);
	});

	test("should be able to fetch answer comments", async () => {
		const student = makeStudent()

		inMemoryStudentsRepository.students.push(student);

		const comment1 = makeAnswerComment({ answerId: new UniqueId("1"), authorId: student.id })
		const comment2 = makeAnswerComment({ answerId: new UniqueId("1"), authorId: student.id })
		const comment3 = makeAnswerComment({ answerId: new UniqueId("1"), authorId: student.id })

		await inMemoryAnswerCommentRepository.create(comment1);
		await inMemoryAnswerCommentRepository.create(comment2);
		await inMemoryAnswerCommentRepository.create(comment3);

		const result = await useCase.execute({ page: 1, answerId: "1" });

		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(expect.arrayContaining([
			expect.objectContaining({commentId: comment1.id}),
			expect.objectContaining({commentId: comment2.id}),
			expect.objectContaining({commentId: comment3.id}),
		]));
	});

	test("should be able to fetch answer comments with pagination", async () => {
		const student = makeStudent()

		inMemoryStudentsRepository.students.push(student);

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentRepository.create(
				makeAnswerComment({ answerId: new UniqueId("1"), authorId: student.id })
			);
		}

		const result = await useCase.execute({ page: 2, answerId: "1" });

		expect(result.value?.comments).toHaveLength(2);
	});
});
