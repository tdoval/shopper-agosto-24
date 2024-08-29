import { NextResponse } from "next/server";
import { confirmOrCorrectMeasure } from "@/lib/actions";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { measure_uuid, new_value } = body;

    if (typeof measure_uuid !== "string" || typeof new_value !== "number") {
      return NextResponse.json(
        {
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos são inválidos",
        },
        { status: 400 },
      );
    }

    const { success, status, error_code, error_description, isValueChanged } =
      await confirmOrCorrectMeasure(measure_uuid, new_value);

    if (!success) {
      return NextResponse.json(
        {
          error_code,
          error_description,
        },
        { status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: isValueChanged
          ? "Valor corrigido e leitura confirmada com sucesso."
          : "Leitura confirmada com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao processar a solicitação de confirmação:", error);
    return NextResponse.json(
      {
        error_code: "SERVER_ERROR",
        error_description: "Erro ao processar a solicitação",
      },
      { status: 500 },
    );
  }
}
