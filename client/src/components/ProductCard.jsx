"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={250}
              className="rounded mb-3 object-cover"
            />
          )}
          <p className="text-sm text-muted-foreground mb-1 truncate">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-primary">₹{product.price}</span>
            <span className="text-sm text-green-600">{product.discount}% Off</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
