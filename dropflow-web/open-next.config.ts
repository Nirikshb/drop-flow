import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare Workers build config for Dropflow.
 * Incremental cache is deliberately left on the default (in-memory) adapter:
 * no production R2 cache bucket is configured in this repository.
 */
export default defineCloudflareConfig({});
