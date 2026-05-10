import { EXPECT_FORMAT } from "@/src/_constants";

export function bufferFromDataUrl(data: string) {
  const matches = data.match(/^data:image\/(.+);base64,(.+)$/);
  if (!matches) {
    throw Error("Wrong image data url");
  }
  return Buffer.from(matches[2], "base64");
}

export async function compressFRomDataUrl(
  dataUrl: string,
  resolution: { width: number; heigh: number }
) {
  const sharp = (await import("sharp")).default;
  const buffer = bufferFromDataUrl(dataUrl);
  const resBuffer = await sharp(buffer)
    .resize({
      ...resolution,
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
