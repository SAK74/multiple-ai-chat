import { IMAGE_AI_RESOLUTION } from "@/src/_constants";
import {
  bufferFromDataUrl,
  compressFRomDataUrl,
} from "@/src/app/api/aichat/compress";
import type { Attachment } from "ai";
import { getImageSize } from "next/dist/server/image-optimizer";

export function filterAttachments(attachments: Attachment[]) {
  return Promise.all(
    attachments.map(async (att) => {
      const buffer = bufferFromDataUrl(att.url);
      const { width, height } = await getImageSize(buffer);

      if (
        (width ?? 0) > IMAGE_AI_RESOLUTION.width ||
        (height ?? 0) > IMAGE_AI_RESOLUTION.heigh
      ) {
        const { url, contentType } = await compressFRomDataUrl(
          att.url,
          IMAGE_AI_RESOLUTION
        );
        return { ...att, url, contentType };
      }
      return att;
    })
  );
}
