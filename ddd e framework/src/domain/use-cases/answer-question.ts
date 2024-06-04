import { UniqueId } from "@/core/entities/unique-id";
import { Answer } from "../entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
}

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswerRepository) {}
	async execute({
		instructorId,
		questionId,
		content,
	}: AnswerQuestionUseCaseRequest) {
		const answer = Answer.create({
			content,
			authorId: new UniqueId(instructorId),
			questionId: new UniqueId(questionId),
		});

		await this.answersRepository.create(answer);

		return answer;
	}
}
