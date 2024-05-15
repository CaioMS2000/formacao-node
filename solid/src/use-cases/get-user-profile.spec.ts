import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, test } from "vitest";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
		getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
    })

    test("shoudl be able able to get user profile", async () => {

        const newUser = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6),
        })

		const { user } = await getUserProfileUseCase.execute({
			userId: newUser.id
		});

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual(newUser.name);
    })
    
    test("shoudl not be able able to get user profile", async () => {



		expect(() => getUserProfileUseCase.execute({
			userId: 'non-existing-id'
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})