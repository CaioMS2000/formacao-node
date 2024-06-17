import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository"
import { ReadNotificationUsecase } from "./read-notification"
import { makeNotification } from "test/factories/make-notification"
import exp from "constants"

let inMemoryNotificationRepository: InMemoryNotificationRepository
let useCase: ReadNotificationUsecase

describe("Read notifications", () => {
    beforeEach(() => {
        inMemoryNotificationRepository = new InMemoryNotificationRepository()
        useCase = new ReadNotificationUsecase(inMemoryNotificationRepository)
    })

    it("shoul be able to read a notification", async () => {
        const notification = makeNotification()

        inMemoryNotificationRepository.create(notification)

        const result = await useCase.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationRepository.notifications[0].readAt).toEqual(expect.any(Date))
    })

    it("shoul not be able to read a notification from someone else", async () => {
        const notification = makeNotification()

        inMemoryNotificationRepository.create(notification)

        const result = await useCase.execute({
            recipientId: "some-one-else",
            notificationId: notification.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryNotificationRepository.notifications[0].readAt).toBeFalsy();
    })
})