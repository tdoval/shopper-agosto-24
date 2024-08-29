import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { isValidBase64Image } from "@/lib/validators";
import { findCustomerById, fetchGoogleGemini } from "@/lib/actions";

export async function POST(req: Request) {
  console.log("Recebendo solicitação de POST para /api/upload");

  const body = await req.json();
  const { image, customerId, measure_datetime, measure_type } = body;

  console.log("Dados recebidos:", {
    image,
    customerId,
    measure_datetime,
    measure_type,
  });

  if (
    !isValidBase64Image(image) ||
    !customerId ||
    !measure_datetime ||
    !measure_type
  ) {
    console.log("Dados inválidos fornecidos.");
    return NextResponse.json(
      {
        error_code: "INVALID_DATA",
        error_description: "Dados fornecidos são inválidos",
      },
      { status: 400 },
    );
  }

  let customer_code = "";
  console.log("Validando cliente...");
  const { customer, error, status } = await findCustomerById(customerId);
  if (error || !customer) {
    console.log("Cliente não encontrado:", customerId);
    return NextResponse.json(
      {
        error_code: error,
        error_description: "Cliente não encontrado",
      },
      { status: status },
    );
  }
  customer_code = customer.customer_code;

  console.log("Enviando imagem para o Google Gemini...");
  const geminiData = {
    imageBase64: image,
    customer_code,
    measure_datetime,
    measure_type,
  };

  const measureValue = await fetchGoogleGemini(geminiData);
  console.log("Valor da medição obtido:", measureValue);

  const measureUUID = uuidv4();
  console.log("Salvando leitura no banco de dados...");

  await prisma.measure.create({
    data: {
      id: measureUUID,
      measure_uuid: measureUUID,
      customerId: customer.id,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      measure_value: 1234,
      image_url: "/path/to/saved/image", // Ajuste conforme necessário
      has_confirmed: false,
    },
  });

  console.log("Leitura salva com sucesso. Enviando resposta...");
  return NextResponse.json({
    image_url: "/path/to/saved/image", // Ajuste conforme necessário
    measure_value: 1234,
    measure_uuid: measureUUID,
  });
}
