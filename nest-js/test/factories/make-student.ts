import { UniqueId } from "@/core/entities/unique-id";
import {
	Student,
	StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { faker } from "@faker-js/faker";

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

    return student
}
