import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.create({ data });
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComment.id.toString(),
			},
		});
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!questionComment) return null;

		return PrismaQuestionCommentMapper.toDomain(questionComment);
	}

	async findManyByQuestionId(
		questionId: string,
		params: PaginationParams
	): Promise<QuestionComment[]> {
		const comments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return comments.map(PrismaQuestionCommentMapper.toDomain);
	}
}
