import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("E2E: Choose question best answer", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)

		await app.init();
	});

	test("[PATCH] /answers/:answerId/choose-as-best", async () => {
		const newUser = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: newUser.id.toString() });
        const question = await questionFactory.makePrismaQuestion({ authorId: newUser.id })
        const answer = await answerFactory.makePrismaAnswer({ questionId: question.id, authorId: newUser.id })
		const response = await request(app.getHttpServer())
			.patch(`/answers/${answer.id.toString()}/choose-as-best`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).toBe(204);

		const questionOnDatabase = await prisma.question.findUnique({
			where:{
				id: question.id.toString(),
			},
		});

        expect(questionOnDatabase?.bestAnswerId).toEqual(answer.id.toString())
	});
});
