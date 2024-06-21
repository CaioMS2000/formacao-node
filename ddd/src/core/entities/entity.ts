import { UniqueId } from "./unique-id";

export class Entity<T>{
    private _id: UniqueId
    protected props: T

    get id(){
        return this._id
    }

    protected constructor(props: T, id?: UniqueId){
        this.props = props
        this._id = id ?? new UniqueId();
    }

    public equals(other: Entity<T>): boolean{
        if(other === this) return true;

        if(other.id == this._id) return true;

        return false
    }
}