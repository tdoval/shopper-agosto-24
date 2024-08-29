import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { measure_uuid: string } },
) {
  try {
    const { measure_uuid } = params;

    const measurement = await prisma.measure.findUnique({
      where: { measure_uuid },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!measurement) {
      return NextResponse.json(
        {
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura não encontrada.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ measurement });
  } catch (error) {
    console.error("Erro ao buscar a medição:", error);
    return NextResponse.json(
      {
        error_code: "SERVER_ERROR",
        error_description: "Erro ao buscar a medição.",
      },
      { status: 500 },
    );
  }
}
