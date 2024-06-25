import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("E2E: authenticate", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST] /sessions", async () => {
		const newUser = await prisma.user.create({
			data: {
				name: "Test",
				email: "test@test.com",
				password: await hash("123456", 8),
			},
		});

		const response = await request(app.getHttpServer())
			.post("/sessions")
			.send({
				name: "Test",
				email: "test@test.com",
				password: "123456",
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("access_token");
	});
});
