import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SESSION_COOKIE } from '../common/guards/session-auth.guard.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import type { User } from '../users/user.entity.js';
import { AuthService } from './auth.service.js';
import {
  ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, UpdateProfileDto,
  VerifyEmailDto,
} from './dto/auth.dto.js';
import { SessionsService } from './sessions.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setSessionCookie(response: Response, token: string): void {
    response.cookie(
      SESSION_COOKIE,
      token,
      SessionsService.cookieOptions(this.config.get<string>('NODE_ENV') === 'production'),
    );
  }

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: RegisterDto, @Res() response: Response): Promise<void> {
    const result = await this.auth.register(dto);
    this.setSessionCookie(response, result.sessionToken);
    response.status(201).json({ user: result.user });
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Res() response: Response): Promise<void> {
    const result = await this.auth.login(dto.email, dto.password);
    this.setSessionCookie(response, result.sessionToken);
    response.status(200).json({ user: result.user });
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    const token = request.cookies?.[SESSION_COOKIE];
    if (token) await this.auth.logout(token);
    response.clearCookie(SESSION_COOKIE, { path: '/' });
    response.status(200).json({ success: true });
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  /** Email links land here and redirect back to the frontend. */
  @Get('verify-email')
  verifyEmailLink(@Req() request: Request, @Res() response: Response): void {
    const token = typeof request.query.token === 'string' ? request.query.token : '';
    response.redirect(`${this.config.getOrThrow<string>('FRONTEND_URL')}/verify-email?token=${encodeURIComponent(token)}`);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@CurrentUser() user: User) {
    return this.auth.me(user.id);
  }

  @Patch('profile')
  @UseGuards(SessionAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(user.id, dto);
  }

  @Get('sessions')
  @UseGuards(SessionAuthGuard)
  listSessions(@CurrentUser() user: User) {
    return this.auth.listSessions(user.id);
  }

  @Delete('sessions/:id')
  @UseGuards(SessionAuthGuard)
  revokeSession(@CurrentUser() user: User, @Param('id') id: string) {
    return this.auth.revokeSession(user.id, id);
  }

  @Post('account-deletion-request')
  @UseGuards(SessionAuthGuard)
  requestDeletion(@CurrentUser() user: User) {
    return this.auth.requestAccountDeletion(user.id);
  }
}
