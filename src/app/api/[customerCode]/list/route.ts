import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MeasureType } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { customerCode: string } },
) {
  const { searchParams } = new URL(req.url);
  const measureTypeParam = searchParams.get("measure_type")?.toUpperCase();
  const { customerCode } = params;

  let measureType: MeasureType | undefined;

  if (measureTypeParam) {
    if (measureTypeParam === "WATER" || measureTypeParam === "GAS") {
      measureType = measureTypeParam as MeasureType;
    } else {
      return NextResponse.json(
        {
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        },
        { status: 400 },
      );
    }
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_code: customerCode },
      include: {
        measures: {
          where: measureType ? { measure_type: measureType } : {},
          select: {
            measure_uuid: true,
            measure_datetime: true,
            measure_type: true,
            has_confirmed: true,
            image_url: true,
          },
        },
      },
    });

    if (!customer || customer.measures.length === 0) {
      return NextResponse.json(
        {
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      customer_code: customer.customer_code,
      measures: customer.measures,
    });
  } catch (error) {
    console.error("Erro ao buscar medidas:", error);
    return NextResponse.json(
      {
        error_code: "SERVER_ERROR",
        error_description: "Erro interno ao buscar medidas",
      },
      { status: 500 },
    );
  }
}
