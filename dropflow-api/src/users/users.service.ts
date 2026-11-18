import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Errors } from '../common/errors.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email: email.trim().toLowerCase() } });
  }

  async create(input: {
    email: string;
    passwordHash: string;
    fullName: string;
  }): Promise<User> {
    const email = input.email.trim().toLowerCase();
    if (await this.findByEmail(email)) {
      throw Errors.conflict('An account with this email already exists');
    }
    const user = this.users.create({
      email,
      passwordHash: input.passwordHash,
      fullName: input.fullName.trim(),
    });
    return this.users.save(user);
  }

  async markEmailVerified(id: string): Promise<void> {
    await this.users.update(id, {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
    });
  }

  async setEmailVerificationToken(id: string, hash: string, expiresAt: Date): Promise<void> {
    await this.users.update(id, {
      emailVerificationTokenHash: hash,
      emailVerificationExpiresAt: expiresAt,
    });
  }

  async setPasswordResetToken(id: string, hash: string | null, expiresAt: Date | null): Promise<void> {
    await this.users.update(id, {
      passwordResetTokenHash: hash,
      passwordResetExpiresAt: expiresAt,
    });
  }

  async updateProfile(id: string, input: { fullName?: string; email?: string }): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw Errors.notFound('User not found');
    if (input.fullName) user.fullName = input.fullName.trim();
    if (input.email) {
      const email = input.email.trim().toLowerCase();
      const existing = await this.findByEmail(email);
      if (existing && existing.id !== id) throw Errors.conflict('Email already in use');
      if (email !== user.email) {
        // A changed address is unverified until the new one is proven.
        user.email = email;
        user.emailVerifiedAt = null;
        user.emailVerificationTokenHash = null;
        user.emailVerificationExpiresAt = null;
      }
    }
    return this.users.save(user);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.users.update(id, { passwordHash });
  }

  async requestDeletion(id: string): Promise<void> {
    await this.users.update(id, { deletionRequestedAt: new Date() });
  }
}
