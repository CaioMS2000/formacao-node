import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashComparer {
    private readonly salt: number = 8;

    hash(plaintext: string): Promise<string> {
        return hash(plaintext, this.salt);
    }
    compare(plaintext: string, hash: string): Promise<boolean> {
        return compare(plaintext, hash);
    }
}