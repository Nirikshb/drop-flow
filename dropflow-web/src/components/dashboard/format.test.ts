import { describe, expect, it } from "vitest";
import {
  fileKind, formatBytes, formatDate, formatNumber, initials, mimeFromFilename,
  truncateMiddle,
} from "./format";

describe("dashboard formatting helpers", () => {
  it("formats byte sizes across units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(5_242_880)).toBe("5.0 MB");
  });

  it("formats numbers with grouping", () => {
    expect(formatNumber(1482)).toBe("1,482");
    expect(formatNumber(Number.NaN)).toBe("—");
  });

  it("uses UTC so server and client renders agree", () => {
    expect(formatDate("2026-11-18T00:30:00Z")).toBe("Nov 18, 2026");
  });

  it("classifies file types used for icons and filters", () => {
    expect(fileKind("image/png")).toBe("image");
    expect(fileKind("application/pdf")).toBe("pdf");
    expect(fileKind("application/json")).toBe("text");
    expect(fileKind("application/zip")).toBe("archive");
  });

  it("guesses MIME types for the local demo queue", () => {
    expect(mimeFromFilename("photo.PNG")).toBe("image/png");
    expect(mimeFromFilename("unknown.xyz")).toBe("application/octet-stream");
  });

  it("derives initials and truncates identifiers", () => {
    expect(initials("Demo Developer")).toBe("DD");
    expect(initials("Alex")).toBe("AL");
    expect(truncateMiddle("df_public_abcdefghijklmnop", 6, 4)).toContain("…");
  });
});
