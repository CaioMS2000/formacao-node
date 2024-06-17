import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository"
import { SendNotificationUsecase } from "./send-notification"

let inMemoryNotificationRepository: InMemoryNotificationRepository
let useCase: SendNotificationUsecase

describe("Send notifications", () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationRepository()
        useCase = new SendNotificationUsecase(inMemoryNotificationRepository)
    })

    it("shoul be able to send a notification", async () => {
        const result = await useCase.execute({
            content: "Hello world",
            title: "Test notification",
            recipientId: "1234567890"
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationRepository.notifications[0]).toEqual(result.value.notification)
    })
})