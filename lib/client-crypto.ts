"use client";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const toBase64 = (bytes: Uint8Array) =>
  typeof window === "undefined"
    ? Buffer.from(bytes).toString("base64")
    : btoa(String.fromCharCode(...bytes));

const fromBase64 = (value: string) => {
  if (typeof window === "undefined") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveKey = async (passphrase: string, salt: Uint8Array) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer,
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptPayload = async (options: {
  data: ArrayBuffer;
  passphrase: string;
  filename?: string;
  mimeType?: string;
  isText: boolean;
}) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(options.passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    options.data
  );

  const payload = {
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    filename: options.filename ?? null,
    mimeType: options.mimeType ?? null,
    isText: options.isText,
  };

  const json = JSON.stringify(payload);
  const bytes = textEncoder.encode(json);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return {
    json,
    hashHex,
  };
};

export const decryptPayload = async (options: {
  json: string;
  passphrase: string;
}) => {
  const payload = JSON.parse(options.json) as {
    salt: string;
    iv: string;
    ciphertext: string;
    filename: string | null;
    mimeType: string | null;
    isText: boolean;
  };

  const salt = fromBase64(payload.salt);
  const iv = fromBase64(payload.iv);
  const ciphertext = fromBase64(payload.ciphertext);
  const key = await deriveKey(options.passphrase, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  if (payload.isText) {
    return {
      type: "text" as const,
      text: textDecoder.decode(decrypted),
    };
  }

  const blob = new Blob([decrypted], {
    type: payload.mimeType ?? "application/octet-stream",
  });

  return {
    type: "file" as const,
    blob,
    filename: payload.filename ?? "decrypted-file",
  };
};
