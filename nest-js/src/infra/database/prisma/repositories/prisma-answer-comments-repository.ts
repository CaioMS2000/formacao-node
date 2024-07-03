import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

		await this.prisma.comment.create({ data });
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComment.id.toString(),
			},
		});
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!answerComment) return null;

		return PrismaAnswerCommentMapper.toDomain(answerComment);
	}

	async findManyByAnswerId(
		answerId: string,
		params: PaginationParams
	): Promise<AnswerComment[]> {
		const comments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return comments.map(PrismaAnswerCommentMapper.toDomain);
	}
}
