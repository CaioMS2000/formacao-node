import { Question } from "@/domain/entities/question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	questions: Question[] = [];

    async create(question: Question) {
        this.questions.push(question);
    }
}