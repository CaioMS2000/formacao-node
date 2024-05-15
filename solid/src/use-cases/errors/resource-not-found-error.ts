export class ResourceNotFoundError extends Error{
    constructor(){
        super('Email already exists')
    }
}