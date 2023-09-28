"use client";

import {
  CreditCard,
  DiscIcon,
  Facebook,
  Instagram,
  Settings,
  Store,
  Twitter,
} from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  checkFacebookConnection,
  checkInstagramConnection,
  checkTwitterConnection,
  checkWooCommerceConnection,
} from "@/lib/connections";
import { ConnectionButton } from "@/components/connection-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/loader";

const SettingsPage = () => {
  const [isPro, setIsPro] = useState(false);
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [isWooCommerceConnected, setIsWooCommerceConnected] = useState(false);

  const [websiteName, setWebsiteName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setConnectionStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/checkSettings");

        if (response.status === 200) {
          setIsPro(response.data.isPro);
          setIsInstagramConnected(true);
          setIsFacebookConnected(response.data.setIsFacebookConnected);
          setIsTwitterConnected(response.data.isTwitterConnected);
          setIsWooCommerceConnected(response.data.isWooCommerceConnected);
          console.log(response.data);
        } else {
          toast.error("Failed to fetch your connections settings"); // Show an error toast
          console.log(response);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    setConnectionStates();
  }, []);

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      {loading ? (
        <Loader message="Fetching your setting configurations!" />
      ) : (
        <div className="px-4 lg:px-8  lg:grid lg:grid-cols-4 lg:gap-4">
          {/* Manage Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-24 w-24 mr-3 text-green-700" />
                Manage Your Subscription
              </CardTitle>
              <CardDescription>
                You can cancel your subscription on this screen
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <SubscriptionButton isPro={isPro} />
            </CardFooter>
          </Card>

          {/* Instagarm Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Instagram className="h-24 w-24 mr-3 text-pink-700" />
                Connect to your Instagram
              </CardTitle>
              <CardDescription>
                To use instagram convert your instagram to a business account
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <ConnectionButton
                connected={isInstagramConnected}
                path="instagram"
              />
            </CardFooter>
          </Card>

          {/* Facebook Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="h-24 w-24 mr-3 text-blue-700" />
                Connect to your FaceBook Page
              </CardTitle>
              <CardDescription>
                Login to Facebook Account & Authorize the page
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <ConnectionButton
                connected={isFacebookConnected}
                path="facebook"
              />
            </CardFooter>
          </Card>

          {/* Twitter Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Twitter className="h-24 w-24 mr-3 text-blue-400" />
                Connect to your Twitter Account
              </CardTitle>
              <CardDescription>
                Login to Twitter account & Authorize
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <ConnectionButton connected={isTwitterConnected} path="twitter" />
            </CardFooter>
          </Card>
          {/* Woocommerce Connection */}
          <Dialog>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-24 w-24 mr-3 text-purple-700" />
                  Connect to your Wooccommerce Account
                </CardTitle>
                <CardDescription>Login to Wooccommerce Account</CardDescription>
              </CardHeader>
              <CardFooter>
                <DialogTrigger
                  className={`${
                    isWooCommerceConnected
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-purple-800 via-purple-600 to-purple-700"
                  } text-white border-0 p-2 rounded-md `}
                >
                  {isWooCommerceConnected ? "Disconnect" : "Connect"}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {!isWooCommerceConnected
                        ? "Which Website Do you want to connect?"
                        : "Are you sure?"}
                    </DialogTitle>
                    {!isWooCommerceConnected && (
                      <DialogDescription>
                        Make sure that your website is in format of
                        "https://yourdomain.com"
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  {!isWooCommerceConnected && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="websiteName" className="text-right">
                          Website Name
                        </Label>
                        <Input
                          id="websiteName"
                          value={websiteName}
                          onChange={(e) => setWebsiteName(e.target.value)}
                          placeholder="My Website"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="websiteUrl" className="text-right">
                          Website URL:
                        </Label>
                        <Input
                          id="websiteUrl"
                          value={websiteURL}
                          onChange={(e) => setWebsiteURL(e.target.value)}
                          placeholder="https://examplewebsite.com"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <ConnectionButton
                      connected={isWooCommerceConnected}
                      path="wooCommerce"
                      websiteName={websiteName}
                      websiteURL={websiteURL}
                    />
                  </DialogFooter>
                </DialogContent>
              </CardFooter>
            </Card>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
