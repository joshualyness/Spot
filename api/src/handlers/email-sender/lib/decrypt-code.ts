import { buildClient, CommitmentPolicy, KmsKeyringNode } from '@aws-crypto/client-node'

const { decrypt } = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT)

let keyring: KmsKeyringNode | undefined

function getKeyring(): KmsKeyringNode {
  if (keyring) return keyring

  const keyArn = process.env.KEY_ARN || process.env.KEY_ID
  if (!keyArn) {
    throw new Error('KEY_ARN / KEY_ID is not set')
  }

  keyring = new KmsKeyringNode({
    generatorKeyId: keyArn,
    keyIds: [keyArn]
  })
  return keyring
}

/** Decrypt Cognito Custom Email Sender `request.code` (base64 Encryption SDK ciphertext). */
export async function decryptCognitoCode(encryptedBase64: string): Promise<string> {
  const { plaintext } = await decrypt(getKeyring(), Buffer.from(encryptedBase64, 'base64'))
  return Buffer.from(plaintext).toString('utf8')
}
