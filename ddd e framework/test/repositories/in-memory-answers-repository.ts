import { Answer } from "@/domain/entities/answer";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";

export class InMemoryAnswerRepository implements AnswerRepository{
    answers: Answer[] = [];

    async create(answer: Answer) {
        this.answers.push(answer);
    }
}