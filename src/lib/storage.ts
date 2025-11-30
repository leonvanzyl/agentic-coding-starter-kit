import { put, del } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Result from uploading a file to storage
 */
export interface StorageResult {
  url: string; // Public URL to access the file
  pathname: string; // Path/key of the stored file
}

/**
 * Uploads a file to storage (Vercel Blob or local filesystem)
 * 
 * @param buffer - File contents as a Buffer
 * @param filename - Name of the file (e.g., "image.png")
 * @param folder - Optional folder/prefix (e.g., "avatars")
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
  folder?: string
): Promise<StorageResult> {
  const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (hasVercelBlob) {
    // Use Vercel Blob storage
    const pathname = folder ? `${folder}/${filename}` : filename;
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
    const filepath = join(targetDir, filename);
    await writeFile(filepath, buffer);

    // Return local URL
    const pathname = folder ? `${folder}/${filename}` : filename;
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


