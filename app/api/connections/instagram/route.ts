import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //To DO: Check if the user has connected instagram accounted
    const isConnected = true;

    if (isConnected) {
      return new NextResponse(
        JSON.stringify({ url: "https://disconnectingurl" })
      );
    } else {
      return new NextResponse(JSON.stringify({ url: "https://connectionurl" }));
    }
  } catch (error) {
    console.log("[INSTAGRAM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
