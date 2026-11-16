/**
 * Mengecilkan foto di browser sebelum diunggah, supaya aman di bawah batas 4,5 MB Vercel
 * dan cepat di koneksi seluler. Server tetap memvalidasi ulang dan memproses ke WebP.
 */
export async function prepareImage(file: File, maxSide = 2000): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file; // biar server yang menolak
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 2_500_000) { bmp.close(); return file; }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/webp", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: blob.type });
  } catch {
    return file;
  }
}
