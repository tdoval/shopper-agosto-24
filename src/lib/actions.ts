import prisma from "@/lib/prisma";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { fetchGoogleGeminiProps } from "./types";

export async function fetchGoogleGemini(data: fetchGoogleGeminiProps) {
  const { imageBase64, measure_type } = data;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            measure_value: {
              type: SchemaType.NUMBER,
            },
          },
        },
      },
    },
  });

  console.log("Tipo de Medição:", measure_type);
  const prompt = `
irei fornecer uma imagem em base 64 de uma leitura de medidor (gás ou água). A imagem pode estar em diferentes formatos (JPEG, PNG, etc.). 
**Imagem:** ${imageBase64}
**Tipo de Medição:** ${measure_type}

* **measure_value:** Valor da medição em **litros** (para água) ou **metros cúbicos** (para gás)

**Se o valor da medição não estiver claro na imagem, estime o valor mais próximo.**

* Caso não consiga processar a imagem retorne **measure_value** como -1
`;

  const result = await model.generateContent(prompt);

  console.log("Resposta do Gemini:", result.response.text());

  try {
    const measurementData = JSON.parse(result.response.text());
    const measurementValue = parseFloat(measurementData[0].measure_value);
    return measurementValue;
  } catch (error) {
    console.error("Erro ao processar a resposta:", error);
    return -1;
  }
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
