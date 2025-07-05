"use client";
import React from "react";
import { DirectionAwareHover } from "./direction-aware-hover-base";

export function DirectionAwareHoverProduct() {
  const products = [
    {
      name: "Premium Headphones",
      price: "$299",
      discount: "20% OFF",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    },
    {
      name: "Smart Watch",
      price: "$399",
      discount: "New Arrival",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
    }
  ];

  return (
    <div className="flex gap-8 justify-center flex-wrap p-8">
      {products.map((product, index) => (
        <DirectionAwareHover 
          key={index}
          imageUrl={product.imageUrl}
          className="w-80 h-96"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded">
              {product.discount}
            </span>
            <h3 className="font-bold text-xl">{product.name}</h3>
            <p className="font-bold text-2xl">{product.price}</p>
            <button className="mt-2 px-4 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-100 transition">
              Add to Cart
            </button>
          </div>
        </DirectionAwareHover>
      ))}
    </div>
  );
}