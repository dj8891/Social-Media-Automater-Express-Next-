import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkWooCommerceConnection } from "@/lib/connections";
import { any } from "zod";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import random from "random";

const settingsUrl = absoluteUrl("/settings");

//Error is most likely a problem in Get function argumentative areas
export async function GET(req: Request) {
  // const postData: any[] = [];
  // try {
  //   // const { userId } = auth();
  //   // const user = await currentUser();
  //   // if (!userId || !user) {
  //   //   return new NextResponse("Unauthorized", { status: 401 });
  //   // }
  //   // const idsEncoded = "s";
  //   // console.log(idsEncoded);
  //   return;
  //   if (!idsEncoded) {
  //     return NextResponse.json(
  //       { message: "Missing ids param" },
  //       { status: 400 }
  //     );
  //   }
  //   const ids = JSON.parse(decodeURIComponent(idsEncoded));
  //   const keys = await prismadb.wooCommerceConnections.findUniqueOrThrow({
  //     where: { userId: userId },
  //   });
  //   if (keys) {
  //     const opt: WooRestApiOptions = {
  //       url: keys.websiteURL || "null",
  //       consumerKey: keys.consumerKey || "null",
  //       consumerSecret: keys.consumerSecret || "null",
  //       version: "wc/v3",
  //       queryStringAuth: false, // Force Basic Authentication as query string true and using under
  //     };
  //     const api = new WooCommerceRestApi(opt);
  //     console.log("CALLING FOR LOOPwith ", api);
  //     for (const id of ids) {
  //       const data = await fetchProductData(id, api);
  //       postData.push(data);
  //       console.log(id);
  //     }
  //     console.log("Returning");
  //   } else {
  //     return new NextResponse("Please authorize a WooCommerce Account first!", {
  //       status: 406,
  //     });
  //   }
  // } catch (error: any) {
  //   console.log("[WOOCOMMERCE_GENERATEPOST_ERROR]", error.message);
  //   if (error?.code == "P2025") {
  //     return new NextResponse("WooCommerce connection not found!", {
  //       status: 402,
  //     });
  //   }
  //   return new NextResponse("Internal Error", { status: 500 });
  // }
}
