import { Entity } from "@/core/entities/entity";
import { UniqueId } from "@/core/entities/unique-id";

interface AttachmentProps {
	title: string;
	url: string;
}

export class Attachment extends Entity<AttachmentProps> {
    get title() {
        return this.props.title;
    }

    get link() {
        return this.props.url;
    }

    static create(props: AttachmentProps, id?: UniqueId) {
        const attachment = new Attachment(props, id);

        return attachment
    }
}