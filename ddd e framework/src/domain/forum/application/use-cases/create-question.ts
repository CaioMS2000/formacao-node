import { Question } from "@/domain/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { UniqueId } from "../../enterprise/entities/unique-id";
import { Either, right } from "@/core/either";

interface CreateQuestionUseCaseRequest {
	content: string;
	title: string;
	authorId: string;
}

type CreateQuestionUseCaseResponse = Either<null, {
	question: Question;
}>

export class CreateQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}

	async execute({content, title, authorId}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			content,
			title,
			authorId: new UniqueId(authorId),
		});

        await this.questionsRepository.create(question);

		return right({question});
	}
}
