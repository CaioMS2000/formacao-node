import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

interface InstructorProps {
	name: string;
}

export class Instructor extends Entity<InstructorProps> {
	static create(props: InstructorProps, id?: UniqueId) {
		const student = new Instructor(props, id);

		return student;
	}
}
