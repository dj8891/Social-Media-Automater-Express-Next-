import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkSubscription } from "@/lib/subscription";
import { checkFacebookConnection, checkInstagramConnection, checkTwitterConnection, checkWooCommerceConnection } from "@/lib/connections";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isPro = await checkSubscription();
    const isInstagramConnected = await checkInstagramConnection();
    const isFacebookConnected = await checkFacebookConnection();
    const isTwitterConnected = await checkTwitterConnection();
    const isWooCommerceConnected = await checkWooCommerceConnection();

    const results = {isPro,isInstagramConnected,isFacebookConnected,isTwitterConnected,isWooCommerceConnected}

    return NextResponse.json(results);

  } catch (error) {
    console.log("[INSTAGRAM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
