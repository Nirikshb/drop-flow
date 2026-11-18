import { Asset } from './asset.entity.js';

export function toAssetDto(asset: Asset, url: string) {
  return {
    id: asset.id,
    projectId: asset.projectId,
    objectKey: asset.objectKey,
    originalFilename: asset.originalFilename,
    mimeType: asset.mimeType,
    sizeBytes: Number(asset.sizeBytes),
    status: asset.status,
    checksum: asset.checksum,
    url,
    createdAt: asset.createdAt,
  };
}
