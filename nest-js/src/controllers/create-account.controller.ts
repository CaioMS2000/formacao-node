import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createAccountBodySchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(3)
})
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/accounts")
export class CreateAccountController{
    constructor(private prisma: PrismaService){}
    
    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema){
        const {name, email, password} = body
        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithSameEmail){
            throw new ConflictException("this email is already in use")
        }

        const hashedPassword = await hash(password, 8)

        return await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
    }
}