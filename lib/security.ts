import crypto from "crypto";

export function sha256(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash("sha256").update(input).digest("hex");
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function newToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function daysFromNow(days: number): Date {
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}
