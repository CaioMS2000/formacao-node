import { UniqueId } from "@/domain/forum/enterprise/entities/unique-id";
import { Answer } from '@/domain/entities/answer';
import { AnswerRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
}

interface AnswerQuestionUseCaseResponse {
	answer: Answer
}

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswerRepository) {}
	async execute({
		instructorId,
		questionId,
		content,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueId(instructorId),
			questionId: new UniqueId(questionId),
		});

		await this.answersRepository.create(answer);

		return {answer};
	}
}
