// lib/uploadToFreeImage.ts
import axios from "axios";
import FormData from "form-data";

export async function uploadImage(base64: string): Promise<string | null> {
  try {
    // limpa o prefixo se vier algo como "data:image/png;base64,AAAA…"
    const payload = base64.replace(/^data:image\/\w+;base64,/, "");

    // monta o multipart/form-data
    const form = new FormData();
    form.append("key", process.env.IMGBB_API_KEY!);
    form.append("image", payload);
    // opcional: força expiração em 10 minutos
    // form.append("expiration", "600");

    const resp = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    return resp.data.data.url as string;
  } catch (err) {
    console.error("❌ Erro ao enviar imagem para ImgBB:", err);
    return null;
  }
}
