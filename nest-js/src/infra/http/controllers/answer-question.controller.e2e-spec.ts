import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("E2E: Answer question", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory
	let attachmentFactory: AttachmentFactory
    let questionFactory: QuestionFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)

		await app.init();
	});

	test("[POST] /questions/:questionId/answers", async () => {
		const newUser = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: newUser.id.toString() });
        const question = await questionFactory.makePrismaQuestion({ authorId: newUser.id })
		const attachment1 = await attachmentFactory.makePrismaAttachment()
		const attachment2 = await attachmentFactory.makePrismaAttachment()
		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id.toString()}/answers`)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				content: "New answer",
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			});

            expect(response.status).toBe(201);

		const answerOnDatabase = await prisma.answer.findFirst({
			where:{
				content: "New answer",
			},
		});

        expect(answerOnDatabase).toBeTruthy()

		const attachmetsOnDatabase = await prisma.attachment.findMany({
			where: { answerId: answerOnDatabase?.id },
		});

		expect(attachmetsOnDatabase).toHaveLength(2);
	});
});
