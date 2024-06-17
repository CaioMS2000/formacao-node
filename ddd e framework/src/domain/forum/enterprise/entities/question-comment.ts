import { Optional } from "@/core/@types/optional";
import { UniqueId } from "@/core/entities/unique-id";
import { Comment, CommentProps } from "./comment";

export interface QuestionCommentProps extends CommentProps {
	questionId: UniqueId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
	get questionId() {
		return this.props.questionId;
	}

	static create(
		props: Optional<QuestionCommentProps, "createdAt">,
		id?: UniqueId
	) {
		const questionComment = new QuestionComment(
			{ ...props, createdAt: props.createdAt ?? new Date() },
			id
		);

		return questionComment;
	}
}
