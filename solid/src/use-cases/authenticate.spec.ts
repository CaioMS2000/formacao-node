import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { compare, hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
		authenticateUseCase = new AuthenticateUseCase(usersRepository);
    })

    test("shoudl be able able to athenticate", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6),
        })

		const { user } = await authenticateUseCase.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
    })
    
    test("shoudl not be able able to athenticate with wrong email", async () => {



		expect(() => authenticateUseCase.execute({
			email: "johndoe@example.com",
			password: "123456",
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    test("shoudl not be able able to athenticate with wrong password", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6),
        })

		expect(() => authenticateUseCase.execute({
			email: "johndoe@example.com",
			password: "12345",
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})