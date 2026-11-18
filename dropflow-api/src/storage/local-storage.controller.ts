import { Controller, Get, Put, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Errors } from '../common/errors.js';
import { LocalStorageService } from './local-storage.service.js';

const INLINE_SAFE = /^(image\/(png|jpe?g|gif|webp|avif)|application\/pdf)$/i;

/**
 * Dev-only HTTP surface for signed local uploads and downloads. Exists so the
 * SDK can PUT directly to "storage" exactly as it would with R2. The module is
 * only registered outside production with the local adapter, and every route
 * requires a valid signature.
 */
@Controller('v1/local-storage')
export class LocalStorageController {
  constructor(private readonly storage: LocalStorageService) {}

  /** Raw body is installed for this path in main.ts (express.raw). */
  @Put()
  async put(
    @Query('key') key: string,
    @Query('token') token: string,
    @Query('expires') expiresRaw: string,
    @Query('mime') mime: string,
    @Query('size') sizeRaw: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const expires = Number(expiresRaw);
    const size = Number(sizeRaw);
    if (!key || !mime || !Number.isInteger(size) || size <= 0) {
      throw Errors.unauthorized('Invalid signed URL');
    }

    const contentType = mime.split(';')[0]!.trim().toLowerCase();
    if (!this.storage.verifyUploadToken(key, expires, token, mime, size)) {
      throw Errors.unauthorized('Invalid or expired signed URL');
    }

    // Reject an oversized body before touching disk. express.raw has already
    // buffered within its hard limit, but the signed length is authoritative.
    const declaredLength = Number(request.headers['content-length']);
    if (Number.isFinite(declaredLength) && declaredLength !== size) {
      throw Errors.uploadInvalid(
        `Signed URL expects ${size} bytes but Content-Length is ${declaredLength}`,
      );
    }

    const body = Buffer.isBuffer(request.body) ? request.body : Buffer.alloc(0);
    if (body.length !== size) {
      throw Errors.uploadInvalid(`Signed URL expects ${size} bytes but received ${body.length}`);
    }

    const sentType = String(request.headers['content-type'] ?? '')
      .split(';')[0]!.trim().toLowerCase();
    if (sentType !== contentType) {
      throw Errors.uploadInvalid('Content-Type does not match the signed declaration');
    }

    await this.storage.writeObject(key, body, contentType);
    response.status(200).json({ stored: true, size: body.length });
  }

  @Get()
  async get(
    @Query('key') key: string,
    @Query('token') token: string,
    @Query('expires') expiresRaw: string,
    @Res() response: Response,
  ): Promise<void> {
    if (!key || !this.storage.verifyDownloadToken(key, Number(expiresRaw), token)) {
      throw Errors.unauthorized('Invalid or expired signed URL');
    }
    const { body, contentType } = await this.storage.readObject(key);
    response.setHeader('Content-Type', contentType);
    response.setHeader('Content-Length', String(body.length));
    // Uploads of active content (HTML/SVG/JS/XML) are refused; these headers
    // remove the remaining browser-sniffing escape hatch.
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Disposition', INLINE_SAFE.test(contentType) ? 'inline' : 'attachment');
    response.setHeader('Cache-Control', 'private, no-store');
    response.status(200).send(body);
  }
}
