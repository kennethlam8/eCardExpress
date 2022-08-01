import * as bcrypt from "bcryptjs";

// set salt round (integer around 1 to 10)
const SALT_ROUNDS = 10;

//Hashing
export async function hashPassword(plainPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
}
//Checking hashed password
export async function checkPassword(plainPassword: string, hashPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(plainPassword, hashPassword);
    return match;
}

