import { AggregateRoot } from "../entities/aggregate-root";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvent{
    ocurredAt: Date;
    aggregate: CustomAggregate;

    constructor(aggregate: CustomAggregate){
        this.ocurredAt = new Date();
        this.aggregate = aggregate;
    }

    getAggregateId(){
        return this.aggregate.id;
    }
}

class CustomAggregate extends AggregateRoot<null>{
    static create(){
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}

describe("Domain events", () => {
    it("should be able to dispatch and listen to domain events", () => {
        const callbackSpy = vi.fn();
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        const aggregate = CustomAggregate.create();

        expect(aggregate.domainEvents).toHaveLength(1)
        
        DomainEvents.dispatchEventsForAggregate(aggregate.id)
        
        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})