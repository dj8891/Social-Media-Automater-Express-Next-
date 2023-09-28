import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkWooCommerceConnection } from "@/lib/connections";

const settingsUrl = absoluteUrl("/settings");

interface wooCommerceConnectionsData {
  userId: String;
  websiteName: String;
  websiteURL: String;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { websiteName, websiteURL } = body;
    console.log(websiteName, websiteURL);

    const store_url = websiteURL;
    const endpoint = "/wc-auth/v1/authorize";

    const params = {
      app_name: "Social Woo Automate",
      scope: "read_write",
      user_id: userId,
      return_url: settingsUrl,
      callback_url: absoluteUrl("/api/connections/wooCommerce/save"),
    };

    console.log("storeURL: ", store_url);

    //To DO: Check if the user has connected instagram accounted
    const isConnected = await checkWooCommerceConnection();

    if (isConnected) {
      await prismadb.wooCommerceConnections.deleteMany({
        where: {
          userId: userId,
        },
      });
      return new NextResponse(JSON.stringify({ url: settingsUrl }));
    } else {
      const query_params = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      const data = {
        userId: userId,
        websiteName: websiteName,
        websiteURL: websiteURL,
      };
      await prismadb.wooCommerceConnections.upsert({
        where: { userId: userId },
        update: data,
        create: data,
      });
      return new NextResponse(
        JSON.stringify({ url: `${store_url}${endpoint}?${query_params}` })
      );
    }
  } catch (error) {
    console.log("[INSTAGRAM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
