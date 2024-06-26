import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";

@Module({
	providers: [
		PrismaService,
		{provide: QuestionsRepository, useClass: PrismaQuestionsRepository},
		{provide: StudentsRepository, useClass: PrismaStudentsRepository},
		PrismaQuestionCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerRepository,
		PrismaAnswerCommentRepository,
		PrismaAnswerAttachmentRepository,
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		StudentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaAnswerRepository,
		PrismaAnswerCommentRepository,
		PrismaAnswerAttachmentRepository,
	],
})
export class DatabaseModule {}
