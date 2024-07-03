import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachments";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let fakeUploader: FakeUploader;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let useCase: UploadAndCreateAttachmentUseCase;

describe("Upload ans create attachment", () => {
	beforeEach(() => {
		fakeUploader = new FakeUploader();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		useCase = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader
		);
	});

	test("should be able to upload and create an attachment", async () => {
		const response = await useCase.execute({
			fileName: "image.jpg",
			fileType: "image/jpg",
			body: Buffer.from("fake-image-buffer"),
		});

        expect(response.isRight()).toBe(true);
        expect(response.value).toEqual({attachment: inMemoryAttachmentsRepository.attachments[0]})
        expect(fakeUploader.uploads).toHaveLength(1)
        expect(fakeUploader.uploads[0]).toEqual(expect.objectContaining({fileName: "image.jpg",}))
	});

    test("should not be able to upload and create an attachment with invalid fileType", async () => {
		const response = await useCase.execute({
			fileName: "song.mp3",
			fileType: "audio/mpeg",
			body: Buffer.from("fake-audio-buffer"),
		});

        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(InvalidAttachmentTypeError);
	});
});
