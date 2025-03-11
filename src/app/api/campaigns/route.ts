import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const allCampaigns = await prisma.campaign.findMany();

    return NextResponse.json({ data: allCampaigns }, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
