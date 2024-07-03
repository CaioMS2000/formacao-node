import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

const maxFileSizeInMB = 1024 * 1024 * 2 // 2mb

@Controller("/attachments")
export class UploadAttachmentController {
    constructor() {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async handle(@UploadedFile(new ParseFilePipe({validators:[new MaxFileSizeValidator({maxSize: maxFileSizeInMB}), new FileTypeValidator({fileType: '.(png|jpg|jpeg|pdf)'})]})) file: Express.Multer.File) {
        return file;
    }
}