import type { D1Database } from '@cloudflare/workers-types';

function generateUUID(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Set version (4) and variant (2) bits
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  // Convert to hex string
  const hex = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-');
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
}

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  type: 'email_verification' | 'password_reset';
  expires_at: number;
  created_at: number;
}

export class AuthDB {
  constructor(private db: D1Database) {}

  // User methods
  async createUser(email: string): Promise<User> {
    const user: User = {
      id: generateUUID(),
      email,
      email_verified: false,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000)
    };

    await this.db.prepare(
      'INSERT INTO users (id, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(user.id, user.email, user.email_verified, user.created_at, user.updated_at).run();

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT id, email, email_verified, created_at, updated_at FROM users WHERE id = ?'
    ).bind(id).first<User>();
    return result || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT id, email, email_verified, created_at, updated_at FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first<User>();
    return result || null;
  }

  // Session methods
  async createSession(userId: string, expiresIn: number = 30 * 24 * 60 * 60): Promise<Session> {
    const session: Session = {
      id: generateUUID(),
      user_id: userId,
      refresh_token: generateUUID(),
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      created_at: Math.floor(Date.now() / 1000)
    };

    await this.db.prepare(
      'INSERT INTO sessions (id, user_id, refresh_token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(session.id, session.user_id, session.refresh_token, session.expires_at, session.created_at).run();

    return session;
  }

  async getSessionByRefreshToken(token: string): Promise<Session | null> {
    const result = await this.db.prepare(
      'SELECT * FROM sessions WHERE refresh_token = ? AND expires_at > ?'
    ).bind(token, Math.floor(Date.now() / 1000)).first<Session>();
    return result || null;
  }

  async deleteSession(id: string): Promise<void> {
    await this.db.prepare(
      'DELETE FROM sessions WHERE id = ?'
    ).bind(id).run();
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.db.prepare(
      'DELETE FROM sessions WHERE user_id = ?'
    ).bind(userId).run();
  }

  // Verification token methods
  async createVerificationToken(
    userId: string,
    type: 'email_verification' | 'password_reset',
    expiresIn: number = 5 * 60
  ): Promise<VerificationToken> {
    const token: VerificationToken = {
      id: generateUUID(),
      user_id: userId,
      token: generateUUID(),
      type,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      created_at: Math.floor(Date.now() / 1000)
    };

    // Delete any existing tokens of the same type for this user
    await this.db.prepare(
      'DELETE FROM verification_tokens WHERE user_id = ? AND type = ?'
    ).bind(userId, type).run();

    await this.db.prepare(
      'INSERT INTO verification_tokens (id, user_id, token, type, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(token.id, token.user_id, token.token, token.type, token.expires_at, token.created_at).run();

    return token;
  }

  async getVerificationToken(token: string, type: 'email_verification' | 'password_reset'): Promise<VerificationToken | null> {
    const result = await this.db.prepare(
      'SELECT * FROM verification_tokens WHERE token = ? AND type = ? AND expires_at > ?'
    ).bind(token, type, Math.floor(Date.now() / 1000)).first<VerificationToken>();
    return result || null;
  }

  async deleteVerificationToken(id: string): Promise<void> {
    await this.db.prepare(
      'DELETE FROM verification_tokens WHERE id = ?'
    ).bind(id).run();
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.db.prepare(
      'UPDATE users SET email_verified = TRUE, updated_at = ? WHERE id = ?'
    ).bind(Math.floor(Date.now() / 1000), userId).run();
  }
} 