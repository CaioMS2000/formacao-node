import { prisma } from "@/lib/prisma";
import { UserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterParams {
	password: string;
	name: string;
	email: string;
}


export class RegisterUseCase{
    constructor(private usersRepository: UserRepository){}

    async execute({ name, email, password }: RegisterParams) {
        const password_hash = await hash(password, 6);
        const userWithSameEmail = await this.usersRepository.findByEmail(email)    
    
        if (userWithSameEmail) throw new UserAlreadyExistsError();
    
        const newUser = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    
        return newUser;
    }

}