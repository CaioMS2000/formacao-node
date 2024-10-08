import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

export interface CommentProps {
	authorId: UniqueId;
	content: string;
	createdAt: Date;
	updatedAt?: Date|null;
}

export abstract class Comment<
	Props extends CommentProps
> extends Entity<Props> {
	private touch() {
		this.props.updatedAt = new Date();
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	set content(v: string) {
		this.props.content = v;
		this.touch();
	}
}
