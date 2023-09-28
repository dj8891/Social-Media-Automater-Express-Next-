"use client";

import axios from "axios";
import { useState } from "react";
import { CheckCheck, Unplug, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

export const ConnectionButton = ({
  connected = false,
  path,
  websiteName = '',
  websiteURL = ''
}: {
  connected: boolean;
  path: String;
  websiteName?: String;
  websiteURL?: String;
}) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`/api/connections/${path}`, {
        websiteName, websiteURL
      });

      console.log(response.data.url)

      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={connected ? "destructive" : "default"}
      disabled={loading}
      onClick={onClick}
    >
      {connected ? "Disconnect" : "Connect"}
    </Button>
  );
};
