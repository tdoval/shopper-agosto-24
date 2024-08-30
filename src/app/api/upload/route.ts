import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { isValidBase64Image } from "@/lib/validators";
import {
  findCustomerById,
  fetchGoogleGemini,
  getCurrentMonthReading,
} from "@/lib/actions";

export async function POST(req: Request) {
  console.log("Recebendo dados da requisição...");
  const body = await req.json();
  console.log("Dados recebidos:", body);
  const { image, customerId, measure_datetime, measure_type, publicImageUrl } =
    body;

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

  console.log("Verificando se já existe uma leitura para este mês...");
  const existingReading = await getCurrentMonthReading(
    customerId,
    new Date(measure_datetime),
    measure_type,
  );

  if (existingReading) {
    console.log("Leitura duplicada encontrada para o mês atual.");
    return NextResponse.json(
      {
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      },
      { status: 409 },
    );
  }

  console.log("Enviando imagem para o Google Gemini...");
  const geminiData = {
    imageBase64: image,
    customer_code,
    measure_datetime,
    measure_type,
  };

  const measureValue = await fetchGoogleGemini(geminiData);
  if (!measureValue) {
    console.log("Erro ao processar a imagem.");
    return NextResponse.json(
      {
        error_code: "INVALID_DATA",
        error_description: "Erro ao processar a imagem.",
      },
      { status: 400 },
    );
  } else if (measureValue === -1) {
    console.log("Não foi possível determinar o valor da medição.");
    return NextResponse.json(
      {
        error_code: "INVALID_DATA",
        error_description: "Não foi possível determinar o valor da medição.",
      },
      { status: 400 },
    );
  }

  console.log("Salvando leitura no banco de dados...");

  let measure_uuid = uuidv4();

  await prisma.measure.create({
    data: {
      id: uuidv4(),
      measure_uuid,
      customerId: customer.id,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      measure_value: measureValue,
      image_url: publicImageUrl,
      has_confirmed: false,
    },
  });

  console.log("Leitura salva com sucesso. Enviando resposta...");
  return NextResponse.json({
    measureValue: measureValue,
    measureUUID: measure_uuid,
  });
}
