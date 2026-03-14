import crypto from "crypto";
import { config } from "@/lib/config";

const algorithm = "aes-256-cbc";

function getKey() {
  return crypto.createHash("sha256").update(config.encryptionKey).digest();
}

export function encryptValue(value: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptValue(payload: string) {
  const [ivHex, encryptedHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

export function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateApiKey(prefix: string, bytes = 24) {
  return `${prefix}_${crypto.randomBytes(bytes).toString("hex")}`;
}
