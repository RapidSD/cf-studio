import { SignJWT } from 'jose';

/**
 * Create a signed JWT with HS256 and given expiration.
 * @param payload - JWT claims
 * @param secret - Signing secret
 * @param expiresIn - Expiration time (e.g. '24h')
 */
export async function createJwt(
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string = '24h'
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secret));
}
