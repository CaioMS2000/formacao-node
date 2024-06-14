import { Answer } from "@/domain/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface EditAnswerUseCaseRequest {
	userId: string;
	answerId: string;
	content: string;
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError|NotAllowedError, {
    answer: Answer
}>

export class EditAnswerUseCase {
	constructor(private answerRepository: AnswerRepository) {}

	async execute({
		userId,
        content,
        answerId,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.toString()!== userId) {
			return left(new NotAllowedError());
		}

		answer.content = content

        await this.answerRepository.save(answer);

		return right({answer});
	}
}
