import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { isLocalStorageEnabled } from './storage/storage.module.js';

const ORIGIN_CACHE_MS = 30_000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config = app.get(ConfigService);
  const isProduction = config.get<string>('NODE_ENV') === 'production';
  const frontendOrigin = normalizeOrigin(config.getOrThrow<string>('FRONTEND_URL'));

  // Rate limiting keys on the client address, so proxy headers must only be
  // trusted when an operator explicitly says a proxy is in front of the API.
  const trustProxy = config.get<string>('TRUST_PROXY');
  if (trustProxy) {
    app.set('trust proxy', trustProxy === 'true' ? 1 : trustProxy);
  }

  app.use(cookieParser());

  // Cookies carry the dashboard session; CORS must allow credentials. Customer
  // site origins are only allowed on the public upload path and never receive
  // credentials. Origin checks are a browser policy, never authentication.
  const dataSource = app.get(DataSource);
  let originCache = { at: 0, origins: new Set<string>() };

  async function projectOrigins(): Promise<Set<string>> {
    if (Date.now() - originCache.at < ORIGIN_CACHE_MS) return originCache.origins;
    try {
      const rows = await dataSource.query<{ origin: string }[]>(
        `SELECT DISTINCT jsonb_array_elements_text("allowed_origins") AS origin FROM "projects"`,
      );
      originCache = {
        at: Date.now(),
        origins: new Set(rows.map((row) => normalizeOrigin(row.origin))),
      };
    } catch {
      // Fail closed: keep the previous set rather than widening access.
    }
    return originCache.origins;
  }

  app.use(async (request: Request, response: Response, next: NextFunction) => {
    const rawOrigin = request.headers.origin;
    if (!rawOrigin) {
      next();
      return;
    }
    const origin = normalizeOrigin(rawOrigin);
    const isFrontend = origin === frontendOrigin;
    const isUploadPath = request.path.startsWith('/v1/uploads');
    const allowed = isFrontend || (isUploadPath && (await projectOrigins()).has(origin));

    if (allowed) {
      response.setHeader('Access-Control-Allow-Origin', rawOrigin);
      response.setHeader('Vary', 'Origin');
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, HEAD, DELETE, OPTIONS',
      );
      response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-dropflow-key',
      );
      response.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, ETag');
      response.setHeader('Access-Control-Max-Age', '600');
      if (isFrontend) response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (request.method === 'OPTIONS') {
      response.status(204).end();
      return;
    }
    next();
  });

  // The local storage adapter needs the exact bytes of a PUT body. JSON parsing
  // would corrupt binary uploads, so raw parsing is scoped to that one
  // development-only path — and the controller is not even registered in
  // production or when R2 is configured.
  if (isLocalStorageEnabled()) {
    app.use('/v1/local-storage', express.raw({ type: '*/*', limit: '110mb' }));
  }

  // DTO validation is centralised: unknown fields are rejected rather than
  // silently ignored, which prevents mass-assignment style bugs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);

  new Logger('Bootstrap').log(
    `Dropflow API listening on http://127.0.0.1:${port} (${isProduction ? 'production' : 'development'})`,
  );
}

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '').toLowerCase();
}

void bootstrap();
