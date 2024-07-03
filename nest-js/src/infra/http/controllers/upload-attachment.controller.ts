import { InvalidAttachmentTypeError } from "@/domain/forum/application/use-cases/errors/invalid-attachment-type-error";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachments";
import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

const maxFileSizeInMB = 1024 * 1024 * 2 // 2mb

@Controller("/attachments")
export class UploadAttachmentController {
    constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async handle(@UploadedFile(new ParseFilePipe({validators:[new MaxFileSizeValidator({maxSize: maxFileSizeInMB}), new FileTypeValidator({fileType: '.(png|jpg|jpeg|pdf)'})]})) file: Express.Multer.File) {
        const result = await this.uploadAndCreateAttachment.execute({
            fileName: file.originalname,
            fileType: file.mimetype,
            body: file.buffer
        })

        if(result.isLeft()){
            const error = result.value

            switch(error.constructor){
                case InvalidAttachmentTypeError:
                    throw new BadRequestException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }

        const {attachment} = result.value

        return {attachmentId: attachment.id.toString()}
    }
}