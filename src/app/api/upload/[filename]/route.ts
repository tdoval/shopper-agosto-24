import { NextResponse } from "next/server";
import { join, extname } from "path";
import { stat, readFile } from "fs/promises";

function getContentType(extension: string): string {
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  { params }: { params: { filename: string } },
) {
  const filePath = join(process.cwd(), "public", "uploads", params.filename);

  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 },
      );
    }

    const fileExtension = extname(filePath).toLowerCase();
    const contentType = getContentType(fileExtension);

    const fileContent = await readFile(filePath);
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Erro ao acessar o arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao acessar o arquivo" },
      { status: 500 },
    );
  }
}
