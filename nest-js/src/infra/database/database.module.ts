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
import {QuestionCommentRepository} from "@/domain/forum/application/repositories/question-comments-repository";
import {QuestionAttachmentRepository} from "@/domain/forum/application/repositories/question-attachments-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

@Module({
	providers: [
		PrismaService,
		{provide: QuestionsRepository, useClass: PrismaQuestionsRepository},
		{provide: StudentsRepository, useClass: PrismaStudentsRepository},
		{provide:QuestionCommentRepository, useClass: PrismaQuestionCommentsRepository},
		{provide:QuestionAttachmentRepository, useClass: PrismaQuestionAttachmentsRepository},
		{provide:AnswerRepository, useClass: PrismaAnswerRepository},
		{provide:AnswerCommentRepository, useClass: PrismaAnswerCommentRepository},
		{provide:AnswerAttachmentRepository, useClass: PrismaAnswerAttachmentRepository},
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		StudentsRepository,
		QuestionCommentRepository,
		QuestionAttachmentRepository,
		AnswerRepository,
		AnswerCommentRepository,
		AnswerAttachmentRepository,
	],
})
export class DatabaseModule {}
