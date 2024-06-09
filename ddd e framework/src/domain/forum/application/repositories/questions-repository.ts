import { Question } from "@/domain/entities/question";

export interface QuestionsRepository {
	create(question: Question): Promise<void>;
}