import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileTypeFromBuffer } from "file-type";
import { AppError } from "../models/app-error.js";

const uploadsRoot = fileURLToPath(new URL("../../uploads/products/", import.meta.url));
const imageDirectory = path.join(uploadsRoot, "images");
const videoDirectory = path.join(uploadsRoot, "videos");

const imageMimeToExtension = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);

const videoMimeToExtension = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"]
]);

const dangerousExtensions = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".dll",
  ".msi",
  ".sh",
  ".ps1",
  ".php",
  ".js",
  ".jar"
]);

const imageMaxBytes = 5 * 1024 * 1024;
const videoMaxBytes = 20 * 1024 * 1024;

function sanitizeBasename(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80) || "arquivo";
}

function assertSafeOriginalName(originalName) {
  const extension = path.extname(String(originalName ?? "")).toLowerCase();

  if (dangerousExtensions.has(extension)) {
    throw new AppError("Tipo de arquivo nao permitido.", {
      code: "INVALID_MEDIA_EXTENSION",
      statusCode: 422
    });
  }
}

async function ensureDirectories() {
  await mkdir(imageDirectory, { recursive: true });
  await mkdir(videoDirectory, { recursive: true });
}

function getFileGroup(fieldName) {
  if (fieldName === "mainImage" || fieldName === "galleryImages") {
    return "image";
  }

  if (fieldName === "videoFiles") {
    return "video";
  }

  throw new AppError("Campo de upload nao suportado.", {
    code: "INVALID_MEDIA_FIELD",
    statusCode: 422
  });
}

async function validateDetectedType(file, group) {
  const detected = await fileTypeFromBuffer(file.buffer);

  if (!detected) {
    throw new AppError("Nao foi possivel validar o conteudo binario do arquivo enviado.", {
      code: "INVALID_MEDIA_BINARY",
      statusCode: 422
    });
  }

  if (group === "image" && !imageMimeToExtension.has(detected.mime)) {
    throw new AppError("Somente imagens jpg, jpeg, png e webp sao permitidas.", {
      code: "INVALID_IMAGE_TYPE",
      statusCode: 422
    });
  }

  if (group === "video" && !videoMimeToExtension.has(detected.mime)) {
    throw new AppError("Somente videos mp4 e webm sao permitidos.", {
      code: "INVALID_VIDEO_TYPE",
      statusCode: 422
    });
  }

  return detected;
}

function validateFileSize(file, group) {
  const limit = group === "image" ? imageMaxBytes : videoMaxBytes;

  if (file.size > limit) {
    throw new AppError(
      group === "image"
        ? "Imagem excede o limite de 5MB."
        : "Video excede o limite de 20MB.",
      {
        code: "MEDIA_FILE_TOO_LARGE",
        statusCode: 413
      }
    );
  }
}

async function persistOne(file, productName) {
  assertSafeOriginalName(file.originalname);
  const group = getFileGroup(file.fieldname);
  validateFileSize(file, group);
  const detected = await validateDetectedType(file, group);
  const safeBase = sanitizeBasename(path.parse(file.originalname).name || productName);
  const extension =
    group === "image"
      ? imageMimeToExtension.get(detected.mime)
      : videoMimeToExtension.get(detected.mime);
  const fileName = `${safeBase}-${randomUUID()}.${extension}`;
  const targetDirectory = group === "image" ? imageDirectory : videoDirectory;
  const absolutePath = path.join(targetDirectory, fileName);

  await writeFile(absolutePath, file.buffer);

  return {
    kind: group,
    fieldName: file.fieldname,
    originalName: file.originalname,
    mimeType: detected.mime,
    size: file.size,
    url: `/uploads/products/${group === "image" ? "images" : "videos"}/${fileName}`,
    absolutePath
  };
}

export async function persistProductMediaFiles(filesByField = {}, productName) {
  await ensureDirectories();

  const files = [
    ...(filesByField.mainImage ?? []),
    ...(filesByField.galleryImages ?? []),
    ...(filesByField.videoFiles ?? [])
  ];

  const persisted = [];

  try {
    for (const file of files) {
      persisted.push(await persistOne(file, productName));
    }
  } catch (error) {
    await removeStoredMediaFiles(persisted);
    throw error;
  }

  return {
    images: persisted.filter((item) => item.kind === "image"),
    videos: persisted.filter((item) => item.kind === "video")
  };
}

export async function removeStoredMediaFiles(files = []) {
  await Promise.all(
    files.map(async (file) => {
      try {
        await unlink(
          file.absolutePath ??
            path.resolve(uploadsRoot, file.url.replace(/^\/uploads\/products\//, ""))
        );
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    })
  );
}

export function getMediaLimits() {
  return {
    imageMaxBytes,
    videoMaxBytes
  };
}
