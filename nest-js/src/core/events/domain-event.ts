import { UniqueId } from "../entities/unique-id"


export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueId
}
