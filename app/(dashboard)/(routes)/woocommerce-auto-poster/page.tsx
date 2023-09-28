"use client";

import * as z from "zod";
import axios from "axios";
import {
  Instagram,
  MessageSquare,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchFormSchema } from "./constants";
import Products from "@/components/products";
import { ScrollArea } from "@/components/ui/scroll-area";

const WooCommerceAutoPoster = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState([]);

  useEffect(() => {
    const setDefaultProducts = async () => {
      try {
        const response = await axios.get("/api/wooCommerce/getAllProducts");

        if (response.status === 200) {
          setProducts(response.data);
        } else {
          toast.error("Failed to fetch your WooCommerce products"); // Show an error toast
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    setDefaultProducts();
  }, []);

  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });
  const isLoading = searchForm.formState.isSubmitting;

  const toggleCheck = async (id: number) => {
    if (checkedProducts.includes(id)) {
      setCheckedProducts(
        checkedProducts.filter((productId) => productId !== id)
      );
    } else {
      const newCheckedProducts = [...checkedProducts];
      newCheckedProducts.push(id);
      setCheckedProducts(newCheckedProducts);
    }
    console.log(checkedProducts);
  };

  const onSearch = async (values: z.infer<typeof searchFormSchema>) => {
    console.log("Submited");
    try {
      const response = await axios.post("/api/instagram-story", {
        period: values,
        time: values,
        image: values,
      });

      if (response.status === 200) {
        toast.success("Instagram Story Recycler Created"); // Show a success toast
      } else {
        toast.error("Failed to create Instagram Story Recycler!"); // Show an error toast
        console.log(response);
      }

      searchForm.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        // Open Pro Modal
      } else if (error?.response?.status === 405) {
        toast.error("Please connect a WooCommerce account first");
        window.location.href = "/settings#wooCommerce";
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="WooCommerce Auto Poster"
        description="With our powerful AI, Generate posts for your social media accounts with a few clicks!"
        icon={ShoppingBag}
        iconColor="text-purple-500"
        bgColor="bg-purple-500/10"
      />
      <div className="px-4 lg:px-8">
        <div className="">
          <Dialog>
            <DialogTrigger className="text-lg text-primary flex-row items-center right-0">
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-8 w-8 text-primary"></PlusCircle>
              </Button>
              <h2>Create</h2>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <Form {...searchForm}>
                    <form
                      onSubmit={searchForm.handleSubmit(onSearch)}
                      className="p-4 mx-4 lg:mx-8 px-3 md:px-6 focus-within:shadow-sm md:flex md:justify-evenly md:items-center flex-row justify-center items-center"
                    >
                      <FormField
                        name="search"
                        render={({ field }) => (
                          <FormItem className="min-w-full mx-4">
                            <FormControl className="mx-4 p-0">
                              <Input type="text" className="p-2" {...field} />
                            </FormControl>
                            {searchForm.formState.errors.search && (
                              <FormMessage>
                                {searchForm.formState.errors.search.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        size="icon"
                        className="mx-4 px-8"
                      >
                        Search
                      </Button>
                    </form>
                  </Form>
                </DialogTitle>
                <DialogDescription className="container mx-auto">
                  {checkedProducts.length >= 1 && (
                    <Button
                      onClick={() => {
                        const queryString = encodeURIComponent(
                          JSON.stringify(checkedProducts)
                        );
                        router.push(
                          `/woocommerce-auto-poster/create/${queryString}`
                        );
                      }}
                      disabled={isLoading}
                      size="icon"
                      className="min-w-full my-2"
                      type="button"
                    >
                      Create posts for selected products
                    </Button>
                  )}
                  {isLoading ? (
                    <Loader message="Loading!" />
                  ) : products.length == 0 ? (
                    <Empty label="No Products!" />
                  ) : (
                    <ScrollArea className="h-96 rounded-md border">
                      {products.map((item) => (
                        <Products
                          item={item}
                          checked={checkedProducts.includes(item.id)}
                          toggleCheck={toggleCheck}
                        />
                      ))}
                    </ScrollArea>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {/* <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {instaAutomations.length === 0 && !isLoading && (
            <Empty label="No Instagram Story Recycler Created." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {instaAutomations.map((message) => (
              <div
                key={message}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WooCommerceAutoPoster;
