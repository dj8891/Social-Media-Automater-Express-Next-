"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Eye } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface MyItem {
  id: number;
  name: string;
  permalink: string;
  price: number;
  image: string;
  // Other properties...
}

const Products = ({ item, checked, toggleCheck }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className="flex-shrink-0">
        <Image
          src={item.image}
          width={50}
          height={50}
          alt="Product Image"
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>

      <div className="ml-4">
        <h2 className="text-lg font-semibold">{item.name}</h2>

        <div className="flex items-center border-b border-gray-200">
          <div className="flex-shrink-0">
            <Checkbox
              className="w-8 h-8"
              checked={checked ? true : false}
              onCheckedChange={() => toggleCheck(item.id)}
            />
          </div>
          <div className="ml-4">
            <p>Price: {item.price}</p>
            <a href={item.permalink} target="_blank">
              <Eye />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
