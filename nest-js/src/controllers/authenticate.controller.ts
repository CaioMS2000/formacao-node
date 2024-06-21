import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Controller("/sessions")
export class AuthenticateController{
    constructor(private jwt: JwtService){}

    @Post()
    async handle(){
        const token = this.jwt.sign({sub: "some-id"})

        return token
    }
}