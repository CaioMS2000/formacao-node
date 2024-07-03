import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
    constructor(message: string = "Invalid attachment type") {
        super(message);
    }
}