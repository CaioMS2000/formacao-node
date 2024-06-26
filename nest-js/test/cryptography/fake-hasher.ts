import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer{
    async compare(plaintext: string, hash: string): Promise<boolean> {
        const res = plaintext.concat('-hashed') === hash

        return res;
    }
    
    async hash(plaintext: string): Promise<string> {
        const res = plaintext.concat('-hashed')

        return res;
    }
}