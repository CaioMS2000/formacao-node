import { UniqueId } from "@/core/entities/unique-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { Either, right } from "@/core/either";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

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

		return right({ answer });
	}
}
