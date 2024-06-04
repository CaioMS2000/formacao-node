import { Slug } from "./value-objects/slug";
import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";
import { Optional } from "@/core/@types/optional";
import dayjs from "dayjs";

interface QuestionProps {
	title: string;
	bestAnswerId?: UniqueId;
	authorId: UniqueId;
	content: string;
	slug: Slug;
	createdAt: Date;
	updateddAt?: Date;
}

export class Question extends Entity<QuestionProps> {
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

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug">,
		id?: UniqueId
	) {
		const question = new Question(
			{
				...props,
				createdAt: new Date(),
				slug: props.slug ?? Slug.createFromText(props.title),
			},
			id
		);

		return question;
	}
}
