import { Slug } from "./value-objects/slug";
import { UniqueId } from "@/core/entities/unique-id";
import { Optional } from "@/core/@types/optional";
import dayjs from "dayjs";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { QuestionAttachment } from "./question-attachment";
import { QuestionAttachmentList } from "./question-attachment-list";

export interface QuestionProps {
	title: string;
	bestAnswerId?: UniqueId;
	authorId: UniqueId;
	content: string;
	slug: Slug;
	attachments: QuestionAttachmentList
	createdAt: Date;
	updateddAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
	private touch() {
		this.props.updateddAt = new Date();
	}

	get title() {
		return this.props.title;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get authorId() {
		return this.props.authorId;
	}

	get content() {
		return this.props.content;
	}

	get slug() {
		return this.props.slug;
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

	get isNew() {
		return dayjs().diff(this.createdAt, "days") <= 3;
	}

	set title(v: string) {
		this.props.title = v;
		this.props.slug = Slug.createFromText(v);
		this.touch();
	}

	set content(v: string) {
		this.props.content = v;
		this.touch();
	}

	set bestAnswerId(id: UniqueId | undefined) {
		this.props.bestAnswerId = id;
		this.touch();
	}

	set attachments(attachments:QuestionAttachmentList) {
		this.props.attachments = attachments;
	}

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
		id?: UniqueId
	) {
		const question = new Question(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				attachments: props.attachments?? new QuestionAttachmentList(),
				slug: props.slug ?? Slug.createFromText(props.title),
			},
			id
		);

		return question;
	}
}
