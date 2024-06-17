import { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";
import { AnswerAttachmentList } from "./answer-attachment-list";

export interface AnswerProps {
	content: string;
	authorId: UniqueId;
	questionId: UniqueId;
	attachments: AnswerAttachmentList;
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

	get attachments() {
		return this.props.attachments;
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

	set attachments(v: AnswerAttachmentList) {
		this.props.attachments = v;
		this.touch();
	}

	static create(
		props: Optional<AnswerProps, "createdAt" | "attachments">,
		id?: UniqueId
	) {
		const answer = new Answer(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				attachments: props.attachments ?? new AnswerAttachmentList(),
			},
			id
		);

		return answer;
	}
}
