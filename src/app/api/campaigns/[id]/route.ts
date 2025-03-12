import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userPublicKey = params.id;

  try {
    const myCampaigns = await prisma.campaign.findMany({
      where: { admin: userPublicKey },
    });

    return NextResponse.json({ data: myCampaigns }, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
