import { UniqueId } from "@/core/entities/unique-id";
import {
	Student,
	StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueId
) {
	const student = Student.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id
	);

	return student;
}

@Injectable()
export class StudentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<StudentProps> = {}) {
		const student = makeStudent(data);

		await this.prisma.user.create({
			data: PrismaStudentMapper.toPersistence(student),
		});

		return student;
	}
}
