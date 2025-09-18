type CloudinaryOptions = {
  w?: number; // width
  h?: number; // height
  c?: "fill" | "fit" | "scale" | "thumb"; // crop mode
  q?: "auto" | number; // quality
  f?: "auto" | "jpg" | "png" | "webp" | "avif"; // format
};

export function getCloudinaryUrl(originalUrl: string, options: CloudinaryOptions = {}): string {
  const {
    w,
    h,
    c = "fill",
    q = "auto",
    f = "auto",
  } = options;

  if (!originalUrl.includes("/upload/")) {
    console.warn("URL không hợp lệ, cần chứa '/upload/'");
    return originalUrl;
  }

  const transforms = [
    w ? `w_${w}` : "",
    h ? `h_${h}` : "",
    c ? `c_${c}` : "",
    q ? `q_${q}` : "",
    f ? `f_${f}` : "",
  ]
    .filter(Boolean) // bỏ empty string
    .join(",");

  return originalUrl.replace("/upload/", `/upload/${transforms}/`);
}
