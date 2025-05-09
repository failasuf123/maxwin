// convertToHttps.ts
export default function convertToHttps(url: string | null): string | null {
    // console.log("url before: ", url)
    if (url === null) {
      return null; // Jika nilai null, kembalikan null
    }
    if (url.startsWith("https://")) {
      return url; // Jika sudah https, kembalikan URL asli
    }
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://"); // Ubah http ke https
    }
    return url; // Jika format tidak dikenali, kembalikan URL asli
  }