import crypto from "crypto";

const algorithm = "aes-256-cbc";
const rawkey = process.env.AES_KEY || "";
const key = Buffer.from(rawkey, "hex");
const ivLength = 16;

if (rawkey.length !== 64 || !key) {
  console.log(rawkey);
}

const genIV = () => crypto.randomBytes(ivLength);

export const encryptAES = (text: string) => {
  try {
    const iv = genIV();
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    encrypted = iv.toString("hex") + encrypted;
    return encrypted;
  } catch (err) {
    throw err;
  }
};

export const decryptAES = (encrypted: string) => {
  try {
    const iv = Buffer.from(encrypted.slice(0, ivLength * 2), "hex");
    const ciphertest = encrypted.slice(ivLength * 2);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(ciphertest, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    throw err;
  }
};
