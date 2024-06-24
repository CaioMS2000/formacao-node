import { Optional } from "@/core/@types/optional";
import { UniqueId } from "@/core/entities/unique-id";
import { Comment, CommentProps } from "./comment";

export interface AnswerCommentProps extends CommentProps {
	answerId: UniqueId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
	get answerId() {
		return this.props.answerId;
	}

	static create(
		props: Optional<AnswerCommentProps, "createdAt">,
		id?: UniqueId
	) {
		const answerComment = new AnswerComment(
			{ ...props, createdAt: props.createdAt ?? new Date() },
			id
		);

		return answerComment;
	}
}
