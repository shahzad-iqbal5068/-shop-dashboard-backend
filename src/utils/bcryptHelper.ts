import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);
export const hashValue = (value: string) => {
  return bcrypt.hash(value, SALT_ROUNDS);
};

export const compareHashValue = (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};
