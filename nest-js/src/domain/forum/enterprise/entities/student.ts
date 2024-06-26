import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

export interface StudentProps {
	name: string;
	email: string;
	password: string;
}

export class Student extends Entity<StudentProps> {
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}
	
	static create(props: StudentProps, id?: UniqueId) {
		const student = new Student(props, id);

		return student;
	}
}
