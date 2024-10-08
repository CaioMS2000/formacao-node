import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("E2E: Comment on question", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory
    let questionFactory: QuestionFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)

		await app.init();
	});

	test("[POST] /questions/:questionId/comments", async () => {
		const newUser = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: newUser.id.toString() });
        const question = await questionFactory.makePrismaQuestion({ authorId: newUser.id })
		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id.toString()}/comments`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "New comment",
			});

            expect(response.status).toBe(201);

		const commentOnDatabase = await prisma.comment.findFirst({
			where:{
				content: "New comment",
			},
		});

        expect(commentOnDatabase).toBeTruthy()
	});
});
