"use client";

import * as z from "zod";
import axios from "axios";
import { Instagram, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const InstagramStory = () => {
  const router = useRouter();
  const [instaAutomations, setInstaAutomations] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: "everyMonth",
      time: "11:20",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submited");
    try {
      const response = await axios.post("/api/instagram-story", {
        period: values.period,
        time: values.time,
        image: values.file,
      });

      if (response.status === 200) {
        toast.success("Instagram Story Recycler Created"); // Show a success toast
      } else {
        toast.error("Failed to create Instagram Story Recycler!"); // Show an error toast
        console.log(response);
      }

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        //Add subscription model or something like that
      } else if (error?.response?.status === 405) {
        toast.error("Please connect an Instagarm account first");
        window.location.href = "/settings#instagram";
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
        title="Instagram Story Recycler"
        description="Best tool to ensure that you have a new story everyday for Instagarm account"
        icon={Instagram}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
                md:flex
                md:justify-evenly
                md:items-center
                flex-row
                justify-center
                items-center
              "
            >
              <FormField
                name="period"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10 lg:min-w-fit">
                    <FormControl className="m-0 p-0">
                      <>
                        <Select defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue className="flex-grow" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="everyday">Everyday</SelectItem>
                            <SelectItem value="everySunday">
                              Every Sunday
                            </SelectItem>
                            <SelectItem value="everyMonday">
                              Every Monday
                            </SelectItem>
                            <SelectItem value="everyTuesday">
                              Every Tuesday
                            </SelectItem>
                            <SelectItem value="everyWednesday">
                              Every Wednesday
                            </SelectItem>
                            <SelectItem value="everyThursday">
                              Every Thursday
                            </SelectItem>
                            <SelectItem value="everyFriday">
                              Every Friday
                            </SelectItem>
                            <SelectItem value="everySaturday">
                              Every Saturday
                            </SelectItem>
                            <SelectItem value="everyMonth">
                              Every Month
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.period && (
                          <FormMessage>
                            {form.formState.errors.period.message}
                          </FormMessage>
                        )}
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Label htmlFor="time">at</Label>
              <FormField
                name="time"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input type="time" className="pl-2" {...field} />
                    </FormControl>
                    {form.formState.errors.time && (
                      <FormMessage>
                        {form.formState.errors.time.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Label htmlFor="file">post</Label>
              <FormField
                name="file"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className="pt-2"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.file && (
                      <FormMessage>
                        {form.formState.errors.file.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Create
              </Button>
            </form>
          </Form>
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

export default InstagramStory;
