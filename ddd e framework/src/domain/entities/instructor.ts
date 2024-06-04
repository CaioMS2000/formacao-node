import { Entity } from "@/domain/forum/enterprise/entities/entity";
import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";

interface InstructorProps {
	name: string;
}

export class Instructor extends Entity<InstructorProps> {
	static create(props: InstructorProps, id?: UniqueId) {
		const student = new Instructor(props, id);

		return student;
	}
}
