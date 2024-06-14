import { AnswerComment } from "@/domain/entities/answer-comment"
import { AnswerRepository } from "../repositories/answers-repository"
import { AnswerCommentRepository } from "../repositories/answer-comments-repository"
import { UniqueId } from "../../enterprise/entities/unique-id"
import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface CommentOnAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, {
    answerComment: AnswerComment
}>

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswerRepository,
        private answerCommentsRepository: AnswerCommentRepository,
    ) {}

    async execute({authorId, answerId, content}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if(!answer) {
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueId(authorId),
            answerId: new UniqueId(answerId),
            content,
        })

        await this.answerCommentsRepository.create(answerComment)

        return right({answerComment})
    }
}