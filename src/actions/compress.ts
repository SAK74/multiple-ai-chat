"use server";

import {
  EXPECT_FORMAT,
  IMAGE_AI_RESOLUTION,
  IMAGE_DB_RESOLUTION,
} from "@/src/_constants";
import sharp from "sharp";

export async function compressFRomDataUrl(dataUrl: string) {
  const matches = dataUrl.match(/^data:image\/(.+);base64,(.+)$/);
  if (!matches) {
    throw Error("Wrong image data url");
  }
  const sharpInst = sharp(Buffer.from(matches[2], "base64"));

  const resBuffer = await sharpInst
    .resize({
      ...IMAGE_DB_RESOLUTION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp()
    .toBuffer();
  return {
    url:
      "data:image/" + EXPECT_FORMAT + ";base64," + resBuffer.toString("base64"),
    contentType: `image/${EXPECT_FORMAT}`,
  };
}

export async function compresFromFile(arrayBUffer: ArrayBuffer) {
  return await sharp(arrayBUffer)
    .resize({
      ...IMAGE_AI_RESOLUTION,
      withoutEnlargement: true,
    })
    .webp()
    .toBuffer();
}
