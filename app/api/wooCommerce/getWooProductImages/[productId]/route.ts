import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";
import { load as CheerioLoad } from "cheerio";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkWooCommerceConnection } from "@/lib/connections";

import random from "random";

const settingsUrl = absoluteUrl("/settings");

const extractImageLinks = (productDescription: string) => {
  const imageLinks: string[] = [];

  // Load the HTML string into a cheerio instance
  const $ = CheerioLoad(productDescription);

  // Find all img tags and extract their src attributes
  $("img").each((index: number, element: any) => {
    const src = $(element).attr("src");
    if (src) {
      imageLinks.push(src);
    }
  });

  return imageLinks;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productImages: string[] = [];
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = params;

    if (!productId) {
      return NextResponse.json(
        { message: "Missing Product ID" },
        { status: 400 }
      );
    }

    const keys = await prismadb.wooCommerceConnections.findUniqueOrThrow({
      where: { userId: userId },
    });

    if (keys) {
      const opt: WooRestApiOptions = {
        url: keys.websiteURL || "null",
        consumerKey: keys.consumerKey || "null",
        consumerSecret: keys.consumerSecret || "null",
        version: "wc/v3",
        queryStringAuth: false, // Force Basic Authentication as query string true and using under
      };
      const api = new WooCommerceRestApi(opt);

      try {
        const resp = await api.get(`products/${productId}`);
        const product = resp.data;

        product?.images.map((image: any) => {
          productImages.push(image.src);
        });
        console.log(`Product IMG are ${productImages}`);

        const productDescriptionImages = extractImageLinks(
          product?.description
        );
        console.log(`ProdDescImages are ${productDescriptionImages}`);
      } catch (err) {
        console.error(err);
        return NextResponse.json(
          { message: "Cannot Retrieve product:", err },
          { status: 401 }
        );
      }
      return NextResponse.json(productImages);
    } else {
      return new NextResponse("Please authorize a WooCommerce Account first!", {
        status: 406,
      });
    }
  } catch (error: any) {
    console.log("[WOOCOMMERCE_GET_PRODUCT_IMAGES_ERROR]", error.message);
    if (error?.code == "P2025") {
      return new NextResponse("WooCommerce connection not found!", {
        status: 402,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
