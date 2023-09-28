import React, { useState } from "react";
import Editor from "react-simple-wysiwyg";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { CustomFileUpload } from "./custom-file-upload";

interface PostProps {
  name: String;
  id: number;
  permalink: String;
  price: String;
  image: string;
  description: String;
  postText: string;
  discardPost: (id?: number) => void;
}

const PostContent = ({
  name,
  id,
  permalink,
  price,
  image,
  description,
  postText,
  discardPost,
}: PostProps) => {
  const [html, setHtml] = useState(postText);
  const [postImages, setPostImages] = useState([image]);
  const [isLoading, setIsLoading] = useState(false);

  function onPostTextChange(e: any) {
    setHtml(e.target.value);
  }

  const onPostImageChange = (url: string | any) => {
    // Check if the URL is already in the array

    const urlIndex = postImages.indexOf(url);
    console.log(urlIndex, url);

    if (urlIndex !== -1) {
      // If the URL is already in the array, remove it
      const updatedImages = [...postImages];
      updatedImages.splice(urlIndex, 1);
      setPostImages(updatedImages);
    } else {
      // If the URL is not in the array, add it
      setPostImages([...postImages, url]);
    }
  };

  const postNow = () => {
    console.log(html, postImages);
    if (html.length <= 3 || html.length >= 255)
      return toast.error("Post Text must be between 3 to 255 charactors.");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 px-6">
          <Editor
            containerProps={{
              style: { resize: "vertical", textAlign: "left" },
            }}
            value={html}
            onChange={onPostTextChange}
          />
          <div className="flex items-center justify-center text-center">
            <CustomFileUpload
              endpoint="postImage"
              values={postImages}
              onChange={onPostImageChange}
              product={{ id: id, name: name }}
              key={id}
            />
          </div>
        </div>
        <CardFooter>
          <Button variant="outline" onClick={postNow} disabled={isLoading}>
            Post Now
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={() => discardPost(id)}
          >
            Discard
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default PostContent;
