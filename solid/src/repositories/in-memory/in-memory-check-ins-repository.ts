import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository{
    public checkIns: CheckIn[] = []
    
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')
        const checkOnSameDate = this.checkIns.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.user_id == userId && isOnSameDate
        })

        if (!checkOnSameDate) return null;

        return checkOnSameDate
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const newCheckIn = {
            id: randomUUID(),
            created_at: new Date(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at? new Date(data.validated_at) : null
        }

        this.checkIns.push(newCheckIn)

        return newCheckIn
    }

    async findManyByUserId(userId: string, page: number) {
        const interval1 = (page-1)*20
        const interval2 = page*20
        const res = this.checkIns.filter(checkIn => checkIn.user_id === userId).slice(interval1, interval2)

        return res
    }
    
    async countByUserId(userId: string) {

        return this.checkIns.filter(checkIn => checkIn.user_id === userId).length
    }

    async findById(id: string){
        return this.checkIns.find(checkIn => checkIn.id === id) ?? null
    }

    async save(checkIn: CheckIn){
        const checkInIndex = this.checkIns.findIndex(_checkIn => _checkIn.id === checkIn.id)

        if(checkInIndex > -1){
            this.checkIns[checkInIndex] = checkIn
        }

        return checkIn
    }
}