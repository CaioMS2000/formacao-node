import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let useCase: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		useCase = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			fakeHasher,
			fakeEncrypter
		);
	});

	test("should be able to authenticate a student", async () => {
		const student = makeStudent({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
		});

        inMemoryStudentsRepository.students.push(student)

		const result = await useCase.execute({
			email: "johndoe@example.com",
			password: "123456",
		});


		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({ accessToken: expect.any(String) });
	});
});
