import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

interface StudentProps {
	name: string;
}

export class Student extends Entity<StudentProps> {
	static create(props: StudentProps, id?: UniqueId) {
		const student = new Student(props, id);

		return student;
	}
}
