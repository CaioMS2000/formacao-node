export abstract class HashComparer{
    abstract compare(plaintext: string, hash: string): Promise<boolean>;
}