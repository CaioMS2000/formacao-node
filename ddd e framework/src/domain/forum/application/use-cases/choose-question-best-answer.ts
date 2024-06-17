import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface ChooseQuestionBestAnswerRequest {
	userId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private questionsRepository: QuestionsRepository
	) {}

	async execute({
		userId,
		answerId,
	}: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const question = await this.questionsRepository.findById(
			answer.questionId.toString()
		);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.toString() !== userId) {
			return left(new NotAllowedError());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
