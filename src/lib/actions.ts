import prisma from "@/lib/prisma";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchGoogleGeminiProps } from "./types";

export async function fetchGoogleGemini(data: fetchGoogleGeminiProps) {
  const { imageBase64, customer_code, measure_datetime, measure_type } = data;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `irei fornecer uma imagem em base 64. Essa imagem pode ser a leitura de gás ou leitura de água de um medidor.
  Também irei fornecer o código do cliente, a data da medição e o tipo de medição. 
  **Imagem:** ${imageBase64}
  **Código do Cliente:** ${customer_code}
  **Data da Medição:** ${measure_datetime}
  **Tipo de Medição:** ${measure_type}
  Você deve retornar um JSON com o UUID da medição, o valor da medição e a URL temporária da imagem processada.
  Exemple: {
“image_url”: string,
“measure_value”:integer,
“measure_uuid”: string
}
  Status Code 200.
  Caso não consiga processar a imagem, retorne um JSON com o erro e o status HTTP 400.
  {
"error_code": "INVALID_DATA",
"error_description": <descrição do
erro>
}
`;

  const result = await model.generateContent(prompt);

  console.log(result);
  return result;
}

export async function findCustomerById(customer_id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customer_id },
    });

    if (!customer) {
      return {
        customer: null,
        error: "CUSTOMER_NOT_FOUND",
        status: 404,
      };
    }

    return { customer, error: null, status: 200 };
  } catch (error) {
    console.error("Erro ao buscar o cliente pelo ID:", error);
    return {
      customer: null,
      error: "SERVER_ERROR",
      status: 500,
    };
  }
}
