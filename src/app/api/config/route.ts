import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const configSchema = z.object({
  publicKey: z.string(),
  admin: z.string(),
  maxDuration: z.string(),
  maxAmount: z.string(),
  fee: z.number().int(),
  bump: z.number().int().min(0).max(255),
  seed: z.string(),
});

// Create Config
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = configSchema.safeParse(body);

    if (!response.success) {
      return NextResponse.json("Invalid Parameter", { status: 411 });
    }
    const { publicKey, admin, maxDuration, maxAmount, fee, bump, seed } =
      response.data;

    const config = await prisma.config.findUnique({
      where: { seed },
    });

    if (config) {
      return NextResponse.json(
        { message: "Config already exists" },
        { status: 403 }
      );
    }

    await prisma.config.create({
      data: { publicKey, admin, maxDuration, maxAmount, fee, bump, seed },
    });
    return NextResponse.json({ message: "Created!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

// Get all configs
export async function GET(request: Request) {
  try {
    const allConfigs = await prisma.config.findMany();
    return NextResponse.json({ data: allConfigs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
