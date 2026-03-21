import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(input: string): Promise<string> {
  return bcrypt.hash(input, SALT_ROUNDS);
}

export async function comparePassword(input: string, hash: string): Promise<boolean> {
  return bcrypt.compare(input, hash);
}
