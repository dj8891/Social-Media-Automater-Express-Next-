import {
  Image,
  Instagram,
  LineChart,
  LucideShoppingBag,
  Settings,
  ShoppingBag,
  Twitter,
} from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: "Instagram Story Recycler",
    icon: Instagram,
    href: "/instagram-story",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "WooCommerce to Facebook Marketplace",
    icon: ShoppingBag,
    href: "/woocommerce-to-facebook-marketplace",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "WooCommerce Auto Poster",
    icon: LucideShoppingBag,
    href: "/woocommerce-auto-poster",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "Auto Tweeter With AI",
    icon: Twitter,
    href: "/auto-tweet-with-ai",
    color: "text-blue-300",
    bgColor: "bg-blue-300/10",
  },
  {
    label: "======================",
    icon: LineChart,
    href: "/",
    color: "text-slate-500",
    bgColor: "bg-slate-500/50",
  },
  {
    label: "Media Library",
    icon: Image,
    href: "/media-library",
    color: "text-green-500",
    bgColor: "bg-green-500/50",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-500",
    bgColor: "bg-slate-500/50",
  },
];
