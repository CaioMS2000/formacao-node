import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../users-repository";

export class InMemoryUsersRepository implements UserRepository{
    public users: User[] = []

    async findByEmail(email: string) {
        const user = this.users.find(user => user.email === email)

        return user? user:null
    }

    async create(data: Prisma.UserCreateInput) {
        const newUser = {
            id: '1',
            created_at: new Date(),
            email: data.email,
            name: data.name,
            password_hash: data.password_hash,
        }

        this.users.push(newUser)

        return newUser
    }
}