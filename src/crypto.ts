import { webcrypto } from "crypto";
const { subtle } = webcrypto;

// #############
// ### Utils ###
// #############

// Function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  var buff = Buffer.from(base64, "base64");
  return buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
}

// ################
// ### RSA keys ###
// ################

// Generates a pair of private / public RSA keys
type GenerateRsaKeyPair = {
  publicKey: webcrypto.CryptoKey;
  privateKey: webcrypto.CryptoKey;
};
export async function generateRsaKeyPair(): Promise<GenerateRsaKeyPair> {
  // TODO implement this function using the crypto package to generate a public and private RSA key pair.
  //      the public key should be used for encryption and the private key for decryption. Make sure the
  //      keys are extractable.

  const keyPair = await subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }, true, ['encrypt', 'decrypt']);

  return keyPair

  // return { publicKey, privateKey }; 
  // remove this
  // return { publicKey: {} as any, privateKey: {} as any };
}

// Export a crypto public key to a base64 string format
export async function exportPubKey(key: webcrypto.CryptoKey): Promise<string> {
  // TODO implement this function to return a base64 string version of a public key

  return arrayBufferToBase64(await subtle.exportKey("pkcs8", key))

  //return btoa(key.toString()) // à vérif

  // remove this
  //return "";
}

// Export a crypto private key to a base64 string format
export async function exportPrvKey(
  key: webcrypto.CryptoKey | null
): Promise<string | null> {
  // TODO implement this function to return a base64 string version of a private key
  if (key == null) { return null; }
  return arrayBufferToBase64(await subtle.exportKey("pkcs8", key))
// remove this
  //return "";
}

// Import a base64 string public key to its native format
export async function importPubKey(
  strKey: string
): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportPubKey function to it's native crypto key object
  return await subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(strKey),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    true,
    ['verify']
  );
  // remove this
  // return {} as any;
}

// Import a base64 string private key to its native format
export async function importPrvKey(
  strKey: string
): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportPrvKey function to it's native crypto key object
  return await subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(strKey),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    true,
    ['verify']
  );
  // remove this
  // return {} as any;
}

// Encrypt a message using an RSA public key
export async function rsaEncrypt(
  b64Data: string,
  strPublicKey: string
): Promise<string> {
  // TODO implement this function to encrypt a base64 encoded message with a public key
  // tip: use the provided base64ToArrayBuffer function

  return arrayBufferToBase64(
    await subtle.encrypt(
      {
        name : 'RSA-OAEP'
      },
      await importPubKey(strPublicKey),
      base64ToArrayBuffer(b64Data)
    )
  )

  // remove this
  // return "";
}

// Decrypts a message using an RSA private key
export async function rsaDecrypt(
  data: string,
  privateKey: webcrypto.CryptoKey
): Promise<string> {
  // TODO implement this function to decrypt a base64 encoded message with a private key
  // tip: use the provided base64ToArrayBuffer function

  return arrayBufferToBase64(
    await subtle.decrypt(
      {
        name : 'RSA-OAEP'
      },
      privateKey, 
      base64ToArrayBuffer(data)
    )
  )

  // remove this
  // return "";
}

// ######################
// ### Symmetric keys ###
// ######################

// Generates a random symmetric key
export async function createRandomSymmetricKey(): Promise<webcrypto.CryptoKey> {
  // TODO implement this function using the crypto package to generate a symmetric key.
  //      the key should be used for both encryption and decryption. Make sure the
  //      keys are extractable.

  return await subtle.generateKey({
    name: 'AES-CBC',
    length: 344,
    hash: "SHA-256"
  },
  true,
  ['encrypt', 'decrypt']
  );

  // remove this
  // return {} as any;
}

// Export a crypto symmetric key to a base64 string format
export async function exportSymKey(key: webcrypto.CryptoKey): Promise<string> {
  // TODO implement this function to return a base64 string version of a symmetric key

  return arrayBufferToBase64(await subtle.exportKey("pkcs8", key))

  // remove this
  return "";
}

// Import a base64 string format to its crypto native format
export async function importSymKey(
  strKey: string
): Promise<webcrypto.CryptoKey> {
  // TODO implement this function to go back from the result of the exportSymKey function to it's native crypto key object

  return await subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(strKey),
    {
      name: 'AES-CBC',
      hash: 'SHA-256',
      length: 344
    },
    true,
    ['verify']
  );

  // remove this
  return {} as any;
}

// Encrypt a message using a symmetric key
export async function symEncrypt(
  key: webcrypto.CryptoKey,
  data: string
): Promise<string> {
  // TODO implement this function to encrypt a base64 encoded message with a public key
  // tip: encode the data to a uin8array with TextEncoder

  return arrayBufferToBase64(
    await subtle.encrypt(
      {
        name: "AES-CBC",
        length: 344
      },
      key,
      base64ToArrayBuffer(data)
    )
  )
  // return "";
}

// Decrypt a message using a symmetric key
export async function symDecrypt(
  strKey: string,
  encryptedData: string
): Promise<string> {
  // TODO implement this function to decrypt a base64 encoded message with a private key
  // tip: use the provided base64ToArrayBuffer function and use TextDecode to go back to a string format

  return arrayBufferToBase64(
    await subtle.decrypt(
      {
        name: "AES-CBC",
        length: 344
      },
      await importSymKey(strKey),
      await base64ToArrayBuffer(encryptedData),
    )
  )
  return "";
}
