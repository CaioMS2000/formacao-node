import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-student";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher
let useCase: RegisterStudentUseCase;

describe("Register Student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher()
		useCase = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});

	test("should be able to register a student", async () => {
		const result = await useCase.execute({
			name: "John Doe",
            email: "johndoe@example.com",
            password: "123456"
		});

		expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({student: inMemoryStudentsRepository.students[0]});
	});

	test("should be able to hash student password uppon registration", async () => {
		const result = await useCase.execute({
			name: "John Doe",
            email: "johndoe@example.com",
            password: "123456"
		});
        const hashedPassword = await fakeHasher.hash("123456")

		expect(result.isRight()).toBe(true);
        expect(inMemoryStudentsRepository.students[0].password).toEqual(hashedPassword);
	});
});
