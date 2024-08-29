import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        customer_code: true,
      },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar clientes",
      },
      { status: 500 },
    );
  }
}
