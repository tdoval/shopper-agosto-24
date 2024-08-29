import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { fetchGoogleGeminiProps, MeasureType } from "./types";

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

export async function getCurrentMonthReading(
  customerId: string,
  measure_datetime: Date,
  measure_type: MeasureType,
) {
  const startDate = startOfMonth(measure_datetime);
  const endDate = endOfMonth(measure_datetime);

  try {
    const existingReading = await prisma.measure.findFirst({
      where: {
        customerId: customerId,
        measure_type: measure_type,
        measure_datetime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return existingReading;
  } catch (error) {
    console.error("Erro ao verificar leitura existente:", error);
    return null;
  }
}

export async function confirmOrCorrectMeasure(
  measure_uuid: string,
  new_value: number,
) {
  try {
    const measure = await prisma.measure.findUnique({
      where: { measure_uuid },
    });

    if (!measure) {
      return {
        success: false,
        status: 404,
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura não encontrada",
      };
    }

    if (measure.has_confirmed) {
      return {
        success: false,
        status: 409,
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura já confirmada",
      };
    }

    const isValueChanged = measure.measure_value !== new_value;

    await prisma.measure.update({
      where: { measure_uuid },
      data: {
        measure_value: new_value,
        has_confirmed: true,
      },
    });

    return { success: true, status: 200, isValueChanged };
  } catch (error) {
    console.error("Erro ao confirmar ou corrigir leitura:", error);
    return {
      success: false,
      status: 500,
      error_code: "SERVER_ERROR",
      error_description: "Erro ao confirmar ou corrigir leitura",
    };
  }
}
