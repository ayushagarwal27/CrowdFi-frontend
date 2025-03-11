
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const donateAmount = searchParams.get("amount");

    if (!id || !donateAmount) {
      return NextResponse.json("Invalid Parameter", { status: 411 });
    }
    const campaign = await prisma.campaign.findUnique({ where: { id } });

    await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        currentAmount: (
          Number(campaign?.currentAmount) + Number(donateAmount)
        ).toString(),
      },
    });

    return NextResponse.json({ message: "Ok" }, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
