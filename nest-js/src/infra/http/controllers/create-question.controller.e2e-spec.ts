import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("E2E: Create question", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST] /questions", async () => {
		const newUser = await prisma.user.create({
			data: {
				name: "Test",
				email: "test@test.com",
				password: await hash("123456", 8),
			},
		});
		const accessToken = jwt.sign({ sub: newUser.id });
		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New question",
				content: "some content",
			});

		expect(response.status).toBe(201);

		const question = await prisma.question.findFirst({
			where: { title: "New question" },
		});

		expect(question).not.toBeNull();
	});
});
