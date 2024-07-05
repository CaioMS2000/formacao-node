import { UniqueId } from "@/core/entities/unique-id";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { Comment as PrismaComment, User as PrismaUser } from "@prisma/client";

type PrismaCommentWithAuthor = PrismaComment & { author: PrismaUser };

export class PrismaCommentWithAuthorMapper {
	static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {

		return CommentWithAuthor.create({
            authorId: new UniqueId(raw.authorId),
            commentId: new UniqueId(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
	}
}
