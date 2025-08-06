/**
 * @description Output format for decompressed files
 */
export const EXPECT_FORMAT: "webp" | "jpeg" | "png" | "tiff" | "gif" = "webp";

/**
 * @description Image resolution to save to db
 */
export const IMAGE_DB_RESOLUTION = { width: 160, heigh: 160 } as const;

/**
 * @description Image resolution to send to provider
 */
export const IMAGE_AI_RESOLUTION = { width: 800, heigh: 800 } as const;
