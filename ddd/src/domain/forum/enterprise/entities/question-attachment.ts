import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

export interface QuestionAttachmentProps {
    questionId: UniqueId;
    attachmentId: UniqueId;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
    get questionId() {
        return this.props.questionId;
    }

    get attachmentId() {
        return this.props.attachmentId;
    }

    static create(props: QuestionAttachmentProps, id?: UniqueId) {
        const questionAttachment = new QuestionAttachment(props, id);

        return questionAttachment
    }
}