export function getPublicId(cloudinaryUrl: string): string {
  const match = cloudinaryUrl?.match(/images_product\/([^/.]+)/);
  return match ? match[1] : "";
}
