import { NextResponse } from "next/server";
import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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
    const tempFileName = `${uuidv4()}-${imageFile.name}`;
    const tempFilePath = join(
      process.cwd(),
      "public/upload_images",
      tempFileName,
    );
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    const imageBuffer = await readFile(tempFilePath);
    const base64Image = imageBuffer.toString("base64");

    // Criar link para acessra a imagem
    const publicImageUrl = `/upload_images/${tempFileName}`;

    // await unlink(tempFilePath);

    return NextResponse.json({
      base64Image,
      imageFilePath: tempFilePath,
      publicImageUrl,
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
