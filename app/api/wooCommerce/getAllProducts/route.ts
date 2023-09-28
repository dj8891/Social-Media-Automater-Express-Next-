import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkWooCommerceConnection } from "@/lib/connections";
import { any } from "zod";

const settingsUrl = absoluteUrl("/settings");

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const keys = await prismadb.wooCommerceConnections.findUniqueOrThrow({
      where: { userId: userId },
    });

    if (keys) {
      const opt: WooRestApiOptions = {
        url: keys.websiteURL,
        consumerKey: keys.consumerKey || "null",
        consumerSecret: keys.consumerSecret || "null",
        version: "wc/v3",
        queryStringAuth: false, // Force Basic Authentication as query string true and using under
      };
      const api = new WooCommerceRestApi(opt);

      const products = await api.get("products", { per_page: 10 });

      const productData: any[] = [];

      products.data.forEach((product: any) => {
        if ((product.status = "publish")) {
          const newProduct = {
            id: product.id,
            name: product.name,
            permalink: product.permalink,
            price: product.sale_price
              ? product.sale_price
              : product.regular_price,
            image: product.images[0].src,
          };
          productData.push(newProduct);
        }
      });
      return NextResponse.json(productData);
    } else {
      return new NextResponse("Please authorize a WooCommerce Account first!", {
        status: 406,
      });
    }
  } catch (error: any) {
    if (error.code == "P2025") {
      return new NextResponse("WooCommerce connection not found!", {
        status: 402,
      });
    }
    console.log("[INSTAGRAM_ERROR]", error.message);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
