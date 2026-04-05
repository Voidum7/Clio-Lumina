import { ACTIVATION_CODE } from '../constants';

const ENCRYPTION_ALGORITHM = 'AES-GCM';
const SALT = new TextEncoder().encode('clio-lumina-salt-888'); // Static salt for deriving the same key
const IV_LENGTH = 12;

/**
 * Derives an AES-GCM CryptoKey from the activation code using PBKDF2.
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(ACTIVATION_CODE),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string to a base64 encoded string containing the IV and ciphertext.
 */
export async function encryptData(plaintext: string): Promise<string> {
  const key = await getCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const enc = new TextEncoder();
  const encoded = enc.encode(plaintext);

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV and Ciphertext
  const combinedBuffer = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
  combinedBuffer.set(iv, 0);
  combinedBuffer.set(new Uint8Array(ciphertextBuffer), iv.length);

  // Convert to Base64 for storage safely to avoid call stack limits
  let binaryStr = '';
  for (let i = 0; i < combinedBuffer.byteLength; i++) {
    binaryStr += String.fromCharCode(combinedBuffer[i]);
  }
  return btoa(binaryStr);
}

/**
 * Decrypts a base64 encoded string containing the IV and ciphertext back to plaintext.
 */
export async function decryptData(encryptedBase64: string): Promise<string | null> {
  try {
    const key = await getCryptoKey();

    // Convert from Base64
    const combinedStr = atob(encryptedBase64);
    const combinedBuffer = new Uint8Array(combinedStr.length);
    for (let i = 0; i < combinedStr.length; i++) {
      combinedBuffer[i] = combinedStr.charCodeAt(i);
    }

    // Extract IV and Ciphertext
    const iv = combinedBuffer.slice(0, IV_LENGTH);
    const ciphertext = combinedBuffer.slice(IV_LENGTH);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (error) {
    console.error('Failed to decrypt data', error);
    return null;
  }
}
