"use client";

import axios from "axios";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";

import PostContent from "@/components/post-content";

const WooCommerceAutoPoster = ({ params }: { params: { ids: string } }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setGeneratedPosts = async () => {
      try {
        const response = await axios.get(
          `/api/wooCommerce/generatePosts/${params.ids}`
        );

        if (response.status === 200) {
          setPosts(response.data);
        } else {
          toast.error("Failed to generate posts"); // Show an error toast
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.ids) {
      setGeneratedPosts();
    } else {
      console.log("No params . ids passed", params);
    }
  }, []);

  const discardPost = (id: number) => {
    setPosts((current) => current.filter((post) => post.id !== id));
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
      {loading ? (
        <Loader message="We are grinding some texts with picturers to generate some high quality posts." />
      ) : posts.length == 0 ? (
        <div>No Posts Generated!</div>
      ) : (
        <div className="px-4">
          Here is the boduthaa logic: {JSON.stringify(posts)}
          {posts.map((post) => (
            <PostContent
              name={post.name}
              description={post.description}
              id={post.id}
              image={post.image}
              permalink={post.permalink}
              postText={post.postText}
              price={post.price}
              key={post.id}
              discardPost={discardPost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WooCommerceAutoPoster;
