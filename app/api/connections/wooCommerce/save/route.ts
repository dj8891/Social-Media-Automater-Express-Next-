import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const data = {
      consumerKey: rawBody.consumer_key,
      consumerSecret: rawBody.consumer_secret,
      key_permissions: rawBody.key_permissions,
      wooCommerce_key_id: rawBody.key_id,
    };
    await prismadb.wooCommerceConnections.update({
      where: {
        userId: rawBody.user_id,
      },
      data,
    });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("SAVE_WOOCOMMERCE_Error", { status: 500 });
  }
}
