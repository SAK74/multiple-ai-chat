import { IMAGE_AI_RESOLUTION } from "@/src/_constants";
import {
  bufferFromDataUrl,
  compressFRomDataUrl,
} from "@/src/app/api/aichat/compress";
import type { Attachment } from "ai";

export async function filterAttachments(attachments: Attachment[]) {
  const sharp = (await import("sharp")).default;
  return Promise.all(
    attachments.map(async (att) => {
      const buffer = bufferFromDataUrl(att.url);
      const metadata = await sharp(buffer).metadata();
      const { width, height } = metadata;

      if (
        (width ?? 0) > IMAGE_AI_RESOLUTION.width ||
        (height ?? 0) > IMAGE_AI_RESOLUTION.heigh
      ) {
        const { url, contentType } = await compressFRomDataUrl(
          att.url,
          IMAGE_AI_RESOLUTION,
        );
        return { ...att, url, contentType };
      }
      return att;
    }),
  );
}
