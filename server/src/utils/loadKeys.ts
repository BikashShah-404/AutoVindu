import { scrypt } from "crypto";
import fs from "fs";
import path from "path";

const loadKey = (fileName: string): string => {
  const keyPath = path.join(process.cwd(), "src", "keys", fileName);

  if (!fs.existsSync(keyPath)) throw new Error(`File not found : ${fileName}`);

  return fs.readFileSync(keyPath, "utf8");
};

export const publicKey = loadKey("public.pem");
export const privateKey = loadKey("private.pem");
