"use server";

import { EXPECT_FORMAT } from "@/src/_constants";
import sharp from "sharp";

export async function compressFRomDataUrl(dataUrl: string, resize?: boolean) {
  const matches = dataUrl.match(/^data:image\/(.+);base64,(.+)$/);
  if (!matches) {
    throw Error("Wrong image data url");
  }
  const sharpInst = sharp(Buffer.from(matches[2], "base64"));

  const resBuffer = await sharpInst
    .resize(160, 160, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
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
  return await sharp(arrayBUffer).webp().toBuffer();
}
