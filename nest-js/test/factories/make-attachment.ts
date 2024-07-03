import { UniqueId } from "@/core/entities/unique-id";
import {
	Attachment,
	AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAttachment(
	override: Partial<AttachmentProps> = {},
	id?: UniqueId
) {
	const attachment = Attachment.create(
		{
			title: faker.lorem.slug(),
			url: faker.lorem.slug(),
			...override,
		},
		id
	);

	return attachment;
}

@Injectable()
export class AttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
		const attachment = makeAttachment(data);

		await this.prisma.attachment.create({
			data: PrismaAttachmentMapper.toPersistence(attachment),
		});

		return attachment;
	}
}
