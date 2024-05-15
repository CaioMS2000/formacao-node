import { beforeEach, describe, expect, test } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe("Register Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		registerUseCase = new RegisterUseCase(usersRepository);
	})

	test("should hash user password upon registration", async () => {
		const { newUser } = await registerUseCase.execute({
			email: "johndoe@example.com",
			name: "John Doe",
			password: "123456",
		});
		const isPasswordHashed = await compare("123456", newUser.password_hash);

		expect(isPasswordHashed).toBe(true);
	});

	test("should not be able to register with same email", async () => {
		const email = "johndoe@example.com";
		const { newUser } = await registerUseCase.execute({
			email,
			name: "John Doe",
			password: "123456",
		});

		await expect(() =>
			registerUseCase.execute({
				email,
				name: "John Doe",
				password: "123456",
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	test("should be able to register", async () => {
		const { newUser } = await registerUseCase.execute({
			email: "johndoe@example.com",
			name: "John Doe",
			password: "123456",
		});

		expect(newUser.id).toEqual(expect.any(String));
	});
});
