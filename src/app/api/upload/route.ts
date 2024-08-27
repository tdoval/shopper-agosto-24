import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

async function saveImageLocally(fileBuffer: Buffer, originalFileName: string) {
  const uploadDir = join(process.cwd(), "public", "uploads");
  const fileName = `${uuidv4()}-${originalFileName}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, fileBuffer);

  return fileName;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    return NextResponse.json(
      {
        error_code: "INVALID_DATA",
        error_description: "Imagem não fornecida.",
      },
      { status: 400 },
    );
  }

  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const savedImageName = await saveImageLocally(buffer, imageFile.name);

    return NextResponse.json({
      imageUrl: `/uploads/${savedImageName}`,
    });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    return NextResponse.json(
      {
        error_code: "SERVER_ERROR",
        error_description: "Erro interno ao processar a imagem.",
      },
      { status: 500 },
    );
  }
}
