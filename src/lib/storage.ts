import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put, del } from "@vercel/blob";

/**
 * Result from uploading a file to storage
 */
export interface StorageResult {
  url: string; // Public URL to access the file
  pathname: string; // Path/key of the stored file
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed MIME types (default: images and documents) */
  allowedTypes?: string[];
}

/**
 * Default storage configuration
 */
const DEFAULT_CONFIG: Required<StorageConfig> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Documents
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/json",
  ],
};

/**
 * Allowed file extensions mapped from MIME types
 */
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
  ".txt",
  ".csv",
  ".json",
]);

/**
 * Sanitize a filename by removing dangerous characters and path traversal attempts
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components (prevent directory traversal)
  const basename = filename.split(/[/\\]/).pop() || filename;

  // Remove or replace dangerous characters
  const sanitized = basename
    .replace(/[<>:"|?*\x00-\x1f]/g, "") // Remove dangerous chars
    .replace(/\.{2,}/g, ".") // Collapse multiple dots
    .replace(/^\.+/, "") // Remove leading dots
    .trim();

  // Ensure filename is not empty
  if (!sanitized || sanitized.length === 0) {
    throw new Error("Invalid filename");
  }

  // Limit filename length
  if (sanitized.length > 255) {
    const ext = sanitized.slice(sanitized.lastIndexOf("."));
    const name = sanitized.slice(0, 255 - ext.length);
    return name + ext;
  }

  return sanitized;
}

/**
 * Validate file for upload
 */
export function validateFile(
  buffer: Buffer,
  filename: string,
  config: StorageConfig = {}
): { valid: true } | { valid: false; error: string } {
  const { maxSize } = { ...DEFAULT_CONFIG, ...config };

  // Check file size
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check file extension
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed extensions: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}`,
    };
  }

  // Optionally check MIME type if provided
  // Note: For full MIME type validation, consider using a library like 'file-type'

  return { valid: true };
}

/**
 * Uploads a file to storage (Vercel Blob or local filesystem)
 *
 * @param buffer - File contents as a Buffer
 * @param filename - Name of the file (e.g., "image.png")
 * @param folder - Optional folder/prefix (e.g., "avatars")
 * @param config - Optional storage configuration
 * @returns StorageResult with url and pathname
 *
 * @example
 * ```ts
 * const result = await upload(fileBuffer, "avatar.png", "avatars");
 * console.log(result.url); // https://blob.vercel.io/... or /uploads/avatars/avatar.png
 * ```
 */
export async function upload(
  buffer: Buffer,
  filename: string,
  folder?: string,
  config?: StorageConfig
): Promise<StorageResult> {
  // Sanitize filename
  const sanitizedFilename = sanitizeFilename(filename);

  // Validate file
  const validation = validateFile(buffer, sanitizedFilename, config);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (hasVercelBlob) {
    // Use Vercel Blob storage
    const pathname = folder ? `${folder}/${sanitizedFilename}` : sanitizedFilename;
    const blob = await put(pathname, buffer, {
      access: "public",
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } else {
    // Use local filesystem storage
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const targetDir = folder ? join(uploadsDir, folder) : uploadsDir;

    // Ensure the directory exists
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    // Write the file
    const filepath = join(targetDir, sanitizedFilename);
    await writeFile(filepath, buffer);

    // Return local URL
    const pathname = folder ? `${folder}/${sanitizedFilename}` : sanitizedFilename;
    const url = `/uploads/${pathname}`;

    return {
      url,
      pathname,
    };
  }
}

/**
 * Deletes a file from storage
 * 
 * @param url - The URL of the file to delete
 * 
 * @example
 * ```ts
 * await deleteFile("https://blob.vercel.io/...");
 * // or
 * await deleteFile("/uploads/avatars/avatar.png");
 * ```
 */
export async function deleteFile(url: string): Promise<void> {
  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (hasVercelBlob) {
    // Delete from Vercel Blob
    await del(url);
  } else {
    // Delete from local filesystem
    // Extract pathname from URL (e.g., /uploads/avatars/avatar.png -> avatars/avatar.png)
    const pathname = url.replace(/^\/uploads\//, "");
    const filepath = join(process.cwd(), "public", "uploads", pathname);

    // Only attempt to delete if file exists
    if (existsSync(filepath)) {
      const { unlink } = await import("fs/promises");
      await unlink(filepath);
    }
  }
}



