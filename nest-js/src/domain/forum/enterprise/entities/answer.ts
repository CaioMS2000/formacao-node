import { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";
import { AnswerAttachmentList } from "./answer-attachment-list";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export interface AnswerProps {
	content: string;
	authorId: UniqueId;
	questionId: UniqueId;
	attachments: AnswerAttachmentList;
	createdAt: Date;
	updatedAt?: Date|null;
}

export class Answer extends AggregateRoot<AnswerProps> {
	private touch() {
		this.props.updatedAt = new Date();
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

	get updatedAt() {
		return this.props.updatedAt;
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
		const isNewAnswer = !id
		
		if(isNewAnswer) answer.addDomainEvent(new AnswerCreatedEvent(answer));

		return answer;
	}
}
