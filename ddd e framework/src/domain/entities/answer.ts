import { Optional } from "@/core/@types/optional";
import { Entity } from "@/domain/forum/enterprise/entities/entity";
import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";

interface AnswerProps {
	content: string;
	authorId: UniqueId;
	questionId: UniqueId;
	createdAt: Date;
	updateddAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
	private touch() {
		this.props.updateddAt = new Date();
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updateddAt() {
		return this.props.updateddAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	set content(v: string) {
		this.props.content = v;
		this.touch();
	}

	static create(props: Optional<AnswerProps, "createdAt">, id?: UniqueId) {
		const answer = new Answer({ ...props, createdAt: new Date() }, id);

		return answer;
	}
}
