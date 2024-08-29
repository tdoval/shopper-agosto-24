import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const measurements = await prisma.measure.findMany({
      take: limit,
      orderBy: {
        measure_datetime: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ measurements });
  } catch (error) {
    console.error("Erro ao buscar medições:", error);
    return NextResponse.json(
      {
        error_code: "SERVER_ERROR",
        error_description: "Erro ao buscar medições.",
      },
      { status: 500 },
    );
  }
}
