import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { period, time, image } = body;

    console.log(period, time, image);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!period) {
      return new NextResponse("Period is required", { status: 403 });
    }

    if (!image) {
      return new NextResponse("Image is required", { status: 403 });
    }

    //A function to retrieve the connected instagram based on userId
    // connectedInstagramAccount = getInstagramACC()
    const connectedInstagramAccount = true;
    if (!connectedInstagramAccount) {
      return new NextResponse("Please connect an Instagram account", {
        status: 405,
      });
    }

    //To DO: Create crob jobs to automatically post to story

    // const freeTrial = await checkApiLimit();
    // const isPro = await checkSubscription();

    // if (!freeTrial && !isPro) {
    //   return new NextResponse(
    //     "Free trial has expired. Please upgrade to pro.",
    //     { status: 403 }
    //   );
    // }

    // TO DO: Please add the logic to schedule a cron job to automatically post to the instagarm account...

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json("Sucessfully created cron job");
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
