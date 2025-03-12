import prisma from "@/lib/prisma";
import { cp } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const campaignCreateSchema = z.object({
  admin: z.string().describe("Pubkey"),
  configKey: z.string().describe("Pubkey reference to Config"),
  title: z.string().max(250),
  description: z.string().max(250),
  url: z.string().max(250),
  startTimestamp: z.string(), // u64 stored as string
  endTimestamp: z.string(), // u64 stored as string
  targetAmount: z.string(), // u64 stored as string
  currentAmount: z.string(), // u64 stored as string
  isCompleted: z.boolean().default(false),
});
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = campaignCreateSchema.safeParse(body);

    if (!response.success) {
      return NextResponse.json("Invalid Parameter", { status: 411 });
    }
    const {
      admin,
      configKey,
      title,
      description,
      url,
      startTimestamp,
      endTimestamp,
      targetAmount,
      currentAmount,
    } = response.data;

    const config = await prisma.config.findFirst({
      where: { publicKey: configKey },
    });

    await prisma.campaign.create({
      data: {
        admin,
        configKey: config?.publicKey,
        title,
        description,
        url,
        startTimestamp,
        endTimestamp,
        targetAmount,
        currentAmount,
      },
    });
    return NextResponse.json({ message: "Created!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

const campaignUpdateSchema = z.object({
  description: z.string(),
  url: z.string(),
});

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (!id || !action) {
      return NextResponse.json("Invalid Parameter", { status: 411 });
    }

    if (action === "close") {
      await prisma.campaign.update({
        where: {
          id,
        },
        data: {
          isCompleted: true,
        },
      });
    } else {
      const body = await request.json();

      const response = campaignUpdateSchema.safeParse(body);
      if (!response.success) {
        return NextResponse.json("Invalid Parameter", { status: 411 });
      }
      const { description, url } = response.data;
      await prisma.campaign.update({
        where: {
          id,
        },
        data: {
          description,
          url,
        },
      });
    }

    return NextResponse.json({ message: "Ok" }, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
