import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ data }) => {
  // Get the first image
  const firstImage = Array.isArray(data.image) ? data.image[0] : data.image;

  // Get the price of the first variant
  const firstVariantPrice = data.variants?.[0]?.price || "Price Not Available";

  return (
    <Link
      to={`/product/${data._id}`}
      className="cursor-pointer relative w-full flex flex-col py-5 h-full border-[1.5px] border-[#c6c6c6] rounded-xl p-3"
    >
      {/* Wishlist Icon */}
      <div
        className="bg-[#B3D4E5] absolute rounded-full h-6 right-5 top-7 w-6 flex items-center justify-center z-10"
      >
        <img
          src="/Vector.png"
          alt="wishlist"
          className="w-3 h-3 object-contain"
        />
      </div>

      {/* Product Image */}
      <div className="flex justify-center items-center w-full">
        <img
          className="aspect-square object-contain h-36 w-36"
          src={firstImage}
          alt={data.name}
        />
      </div>

      {/* Product Details */}
      <div className="flex gap-3 flex-col pb-2">
        <div className="text-base text-textColor whitespace-nowrap font-medium font-poppins overflow-hidden pt-2 uppercase">
          {data.name}
        </div>

        {/* Display First Variant Price */}
        <div className="text-base font-poppins capitalize text-[#4A4A4A] font-semibold overflow-hidden whitespace-nowrap">
          ₹{firstVariantPrice}
        </div>

        {/* Star Ratings */}
        <div className="flex flex-row gap-2 text-left items-center">
          {[...Array(5)].map((_, index) => (
            <img
              key={index}
              className="object-cover h-[14px] w-[14px]"
              src="/review4.png"
              alt="review"
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
