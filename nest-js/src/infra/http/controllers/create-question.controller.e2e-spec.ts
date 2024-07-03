import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("E2E: Create question", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory
	let attachmentFactory: AttachmentFactory
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AttachmentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)

		await app.init();
	});

	test("[POST] /questions", async () => {
		const newUser = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: newUser.id.toString() });
		const attachment1 = await attachmentFactory.makePrismaAttachment()
		const attachment2 = await attachmentFactory.makePrismaAttachment()
		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New question",
				content: "some content",
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			});

		expect(response.status).toBe(201);

		const question = await prisma.question.findFirst({
			where: { title: "New question" },
		});

		expect(question).not.toBeNull();

		const attachmetsOnDatabase = await prisma.attachment.findMany({
			where: { questionId: question?.id },
		});

		expect(attachmetsOnDatabase).toHaveLength(2);
	});
});
