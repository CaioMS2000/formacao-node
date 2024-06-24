import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("E2E: Fetch recent questions", () => {
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

	test("[GET] /questions", async () => {
		const newUser = await prisma.user.create({
			data: {
				name: "Test",
				email: "test@test.com",
				password: await hash("123456", 8),
			},
		});
		const accessToken = jwt.sign({ sub: newUser.id });
        const data = Array.from({length: 10}, (v, i) => i).map(i => ({title: `Question ${i}`, content: `Content ${i}`, authorId: newUser.id, slug: `slug-${i}`}))
        console.log(data)

        await prisma.question.createMany({
            data,
        })

		const response = await request(app.getHttpServer())
			.get("/questions")
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				title: "New question",
				content: "some content",
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({questions: Array.from({length: 10}, (v, i) => i).map(i => (expect.objectContaining({title: `Question ${i}`})))});
	});
});
