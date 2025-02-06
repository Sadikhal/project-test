import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";
import { apiRequest } from "../../lib/apiRequest";
import Slider from "../../components/Slider";
import AddProduct from "../../components/AddProduct";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/seprator";

function Product() {
  // State management
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedRam, setSelectedRam] = useState(4);
  const maxQuantity = 10;

  /**
   * Fetches product data from API
   */
  useEffect(() => {
    if (!productId) {
      setError("Invalid product ID.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get(`/product/${productId}`);
        response.data ? setProduct(response.data) : setError("Product not found.");
      } catch (error) {
        console.error("API Error:", error);
        setError("Something went wrong while fetching the product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  /**
   * Handles RAM selection
   *  Selected RAM value
   */
  const handleRamSelect = (ram) => setSelectedRam(ram);

  /**
   * Adjusts product quantity within allowed range
   *  - 'increment' or 'decrement'
   */
  const handleQuantityChange = (type) => {
    setQuantity(prev => Math.min(maxQuantity, Math.max(1, 
      type === "increment" ? prev + 1 : prev - 1
    )));
  };

  // Find selected RAM variant
  const selectedVariant = product?.variants?.find(v => v.ram === selectedRam);

  return (
      <div className="w-full pt-8 px-5 md:px-12 flex flex-col gap-5">   
     {isLoading ? (
        <p className="text-center py-10">Loading...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : (
        <>
      <div className="flex justify-start items-center w-full gap-6 h-8">
        <Link className="font-medium text-base font-poppins" to="/">Home</Link>
        <BsChevronRight className="text-[#292D32] text-xl" />
        <span className="font-medium text-base font-poppins">Product Details</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Slider */}
        <div className="w-full lg:w-[50%]">
          <Slider images={Array.isArray(product.image) ? product.image : [product.image]} />
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-[50%] flex flex-col gap-4">
          <h1 className="font-medium 2xl:text-[30px] lg:text-[26px] text-[24px] text-textColor  font-poppins uppercase">
            {product.name}
          </h1>

          {/* Price Display */}
          {selectedVariant ? (
            <p className="font-semibold 2xl:text-[29px] lg:text-[25px] text-[22px] text-[#4A4A4A] font-poppins">
              ${selectedVariant.price}
            </p>
          ) : (
            <p className="font-semibold 2xl:text-[20px] xl:text-[18px] text-red-500 font-poppins">
              This variant is not available
            </p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#232323] text-lg">Availability:</span>
            {selectedVariant?.quantity > 0 ? (
              <span className="font-medium text-textGreen flex items-center gap-2 capitalize">
                <img src="/tick.png" className="w-6 h-7 object-contain" alt="tick" />
                In stock ({selectedVariant.quantity} left)
              </span>
            ) : (
              <span className="font-medium text-red-500">Out of stock</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            
            {selectedVariant?.quantity > 0 ? (
              <span className="font-normal text-[#5D5D5D] flex items-center text-sm font-poppins">
                Hurry up! only {selectedVariant.quantity} product left in stock!
                
              </span>
            ) : (
              <span className="font-medium text-red-500">Out of stock</span>
            )}
          </div>
          <Separator className="my-6" />
          {/* RAM Selection */}
          <div className="flex items-center gap-6">
            <span className="font-medium text-[#232323] text-base">Ram:</span>
            <div className="flex space-x-3">
              {[4, 8, 16].map((ram) => (
                <button
                  key={ram}
                  onClick={() => handleRamSelect(ram)}
                  className={`px-2 py-1 font-medium text-base bg-[#EEEEEE] text-[#434343] font-poppins ${
                    selectedRam === ram ? "border-[#000000] border-[1.5px]" : "border-none"
                  } transition`}
                >
                  {ram} GB
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          {selectedVariant?.quantity > 0 && (
            <div className="flex items-center gap-6">
              <span className="font-medium text-[#232323] text-base">Quantity:</span>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="px-2 font-medium text-base bg-[#EEEEEE] text-[#434343] font-poppins border border-[#BDBDBD]"
                >
                  -
                </button>
                <span className="px-5 font-medium text-base bg-[#EEEEEE] text-[#434343] font-poppins border border-[#BDBDBD]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="px-2 font-medium text-base bg-[#EEEEEE] text-[#434343] font-poppins border border-[#BDBDBD]"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-2 items-center">
            <AddProduct title="Edit" product={product} />
            {selectedVariant?.quantity > 0 ? (
              <Button className="lg:px-12 px-8 md:px-12 py-[22px] font-semibold text-base text-bgColor bg-buttonColor hover:bg-buttonColor/80 rounded-2xl">
                Buy it now
              </Button>
            ) : (
              <Button disabled className="px-16 py-4 font-semibold text-base text-bgColor bg-gray-400 rounded-full">
                Out of stock
              </Button>
            )}
            <div className="w-14 h-14 bg-[#EEEEEE] rounded-full flex items-center justify-center">
              <img src="/heart3.png" className="w-6 h-6 object-cover cursor-pointer" alt="wishlist" />
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default Product;