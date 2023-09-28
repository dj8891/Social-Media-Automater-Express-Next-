import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";
import Replicate from "replicate";

import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { checkWooCommerceConnection } from "@/lib/connections";

import random from "random";

const settingsUrl = absoluteUrl("/settings");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const model =
  "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608";

const system =
  "You are a social media content creator expert. Based on the detail I will provide below and image, Give me short post text that I can post. Dont contain any unnecessary information, short text that I can post as description or caption in any social media platform.";

export async function GET(
  req: NextRequest,
  { params }: { params: { ids: string } }
) {
  const postData: any[] = [];
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!replicate) {
      return new NextResponse("Replicate cannot be Initialized", {
        status: 500,
      });
    }

    const idsEncoded = params.ids;

    if (!idsEncoded) {
      return NextResponse.json(
        { message: "Missing ids param" },
        { status: 400 }
      );
    }

    const ids = JSON.parse(decodeURIComponent(idsEncoded));

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

      for (const id of ids) {
        try {
          const resp = await api.get(`products/${id}`);
          const product = resp.data;

          const randInt = random.int(0, product.images.length - 1);

          const input = {
            image: product?.images[randInt]?.src
              ? product?.images[randInt]?.src
              : null,
            question: `${system} \n ${product?.description}`,
          };
          let postText;
          try {
            postText = await replicate.run(model, { input });
          } catch (error) {
            postText = null;
            console.error("REPLICA_API_RUN_GENERATEPOST: ", error);
          }

          const newProduct = {
            id: product?.id,
            name: product?.name,
            permalink: product?.permalink,
            price: product?.price,
            image: product?.images[randInt]?.src,
            description: product?.description,
            postText:
              typeof postText == "string"
                ? postText
                : product?.short_description,
          };
          postData.push(newProduct);
        } catch (err) {
          console.log(err);
          return NextResponse.json(
            { message: "Cannot Retrieve product:", err },
            { status: 401 }
          );
        }
      }
      return NextResponse.json(postData);
    } else {
      return new NextResponse("Please authorize a WooCommerce Account first!", {
        status: 406,
      });
    }
  } catch (error: any) {
    console.log("[WOOCOMMERCE_GENERATEPOST_ERROR]", error.message);
    if (error?.code == "P2025") {
      return new NextResponse("WooCommerce connection not found!", {
        status: 402,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
