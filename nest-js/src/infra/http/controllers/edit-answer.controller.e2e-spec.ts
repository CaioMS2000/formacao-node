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

describe("E2E: Edit answers", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test("[PUT] /answers/:id", async () => {
		const newUser = await studentFactory.makePrismaStudent();
        const userId = newUser.id;
		const accessToken = jwt.sign({ sub: userId.toString() });
		const question = await questionFactory.makePrismaQuestion({
			authorId: newUser.id,
		});
		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
            authorId: userId,
		});
        const answerId = answer.id;
		const response = await request(app.getHttpServer())
			.put(`/answers/${answerId.toString()}`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "content has changed",
			});
        console.log(response)

		expect(response.status).toBe(204);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: "content has changed",
			},
		});

		expect(answerOnDatabase).toBeTruthy();
	});
});
