import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/apiRequest';
import axios from 'axios';

const Sample = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiRequest.post('/category', { ...formData });
      setLoading(false);
      navigate('/');
      alert("succes")
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input
        id="name"
        name="name"
        onChange={handleChange}
        placeholder="Enter category name"
        className="placeholder:text-[#A7A7A7] placeholder:text-xs border-[#3C3C3C] px-3 w-60 rounded-xl"
      />
      <button type="submit" disabled={loading} className="px-5 bg-buttonColor text-sm font-medium text-bgColor uppercase">
        {loading ? 'Loading...' : 'Add'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>












/////////

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dailog'
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { ChevronDown } from 'lucide-react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { apiRequest } from '../lib/apiRequest';


const AddProduct = () => {

   const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const ramOptions = [4, 8];
  const maxQuantity = 100;
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    desc: '',
    variants: [],
    images: [],
  });



  const [variants, setVariants] = useState(ramOptions.map(ram => ({
    ram,
    price: '',
    quantity: 1
  })));


  const handleQuantityChange = (index, type) => {
    setVariants(prevVariants => 
      prevVariants.map((variant, i) => 
        i === index 
          ? { ...variant, quantity: type === "increment" ? Math.min(variant.quantity + 1, maxQuantity) : Math.max(variant.quantity - 1, 1) } 
          : variant
      )
    );
  };

  const handlePriceChange = (index, value) => {
    setVariants(prevVariants =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, price: value } : variant
      )
    );
  };


// useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await apiRequest.get('/category');
//         setCategories(response.data.categories || []); 
//       } catch (error) {
//         console.error(error);
//         setError("Something went wrong while fetching categories.");
//       } finally {
//         setIsLoading(false);
//       }
//     };



useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/subCategory');
        setSubCategories(response.data);
        console.error(error);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while fetching categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);





  const handleRamSelect = (index, ram) => {
    setVariants(prevVariants =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, ram } : variant
      )
    );
    setSelectedRam(ram);
  };

    
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
    
  //  const [variants, setVariants] = useState([{ ram: "", price: "", quantity: "" }]);
  
    // const addVariant = () => {
    //   setVariants([...variants, { ram: "", price: "", quantity: "" }]);
    // };
  
    // Remove Variant Row
    // const removeVariant = (index) => {
    //   const updatedVariants = variants.filter((_, i) => i !== index);
    //   setVariants(updatedVariants);
    // };
  return (
   
      <Dialog className="w-full">
  <DialogTrigger>
    <Button variant="secondary" size="base" className="text-lg">
              Add product
             </Button>
  </DialogTrigger>
  <DialogContent className="px-4 lg:px-12 lg:w-[60%] md-w-[85%] w-full">
    <DialogHeader className="flex items-center justify-center py-6">
      <DialogTitle className="font-semibold text-xl text-[#3C3C3C]"> Add  Product</DialogTitle>
     
    </DialogHeader>
 <div className='flex flex-col gap-5'>
 
    <div className="flex flex-row w-full items-center justify-between gap-10 ">
      <label className='text-[#A7A7A7] capitalize font-medium text-lg' htmlFor="email">Title :</label>
      <Input className="w-[75%] placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-sm border-[#A7A7A7] px-3 " type="email" id="email" placeholder="title" />
    </div>


    <div className="flex flex-row w-full  justify-between gap-10 ">
      <label className='text-[#A7A7A7] capitalize font-medium text-lg text-nowrap' htmlFor="email">Variants :</label>
      {/* <Input className="w-[75%] placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-base border-[#A7A7A7] px-3 " type="email" id="email" placeholder="Email" /> */}
<div className='flex flex-col gap-1 w-[75%] '>
     {variants.map((variant, index) => (
  <div key={index} className="flex items-center justify-between mb-2 w-full gap-5">
    <div className='flex flex-row flex-1 items-center gap-2'>
      <label className='text-[#A7A7A7] capitalize text-nowrap font-medium text-sm'>RAM:</label>
      <button
        onClick={() => handleRamSelect(index, variant.ram)}
        className={`p-2 border w-full text-[#3C3C3C] font-medium text-sm rounded-xl space-x-3 bg-transparent ${selectedRam === variant.ram ? "border-[#000000] border-[1.5px]" : "border-[#A7A7A7]"}`}
      >
        {variant.ram} GB
      </button>
    </div>

    <div className='flex flex-row flex-1 items-center gap-2'>
      <label className='text-[#A7A7A7] capitalize text-nowrap font-medium text-sm'>Price:</label>
      <Input
        type="number"
        value={variant.price}
        onChange={(e) => handlePriceChange(index, e.target.value)}
        className="p-2 border text-[#3C3C3C] font-medium text-sm border-[#A7A7A7] w-full rounded-xl space-x-3 bg-transparent placeholder:text-[#3C3C3C]"
        placeholder="$456"
        required
      />
    </div>

    <div className='flex flex-row flex-1 items-center gap-2'>
      <label className='text-[#A7A7A7] capitalize text-nowrap font-medium text-sm'>QTY:</label>
      <div className="p-1 border text-[#3C3C3C] font-medium text-base flex flex-row justify-between items-center border-[#A7A7A7] w-full rounded-xl space-x-3 bg-transparent">
        <GoChevronLeft
          onClick={() => handleQuantityChange(index, "decrement")}
          className='text-[#A7A7A7] font-normal text-3xl cursor-pointer'
        />
        <span>{variant.quantity}</span>
        <GoChevronRight
          onClick={() => handleQuantityChange(index, "increment")}
          className='text-[#A7A7A7] font-normal text-3xl cursor-pointer'
        />
      </div>
    </div>
  </div>
))}
        </div>  
        
    </div>


    <div className="flex flex-row w-full items-center justify-between gap-10 ">
      <label className='text-[#A7A7A7]  font-medium text-nowrap text-lg' htmlFor="email">Sub category :</label>


      <Select>
      <SelectTrigger className="outline-none focus:outline-none 
          focus-visible:ring-0  focus-visible:ring-offset-0  w-[75%] placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-sm border-[#A7A7A7] px-3 rounded-lg flex flex-row justify-between text-[#3C3C3C] font-medium text-sm">
        <SelectValue className="placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-sm text-[#3C3C3C] font-medium text-sm"  placeholder="Select category" />
        <ChevronDown className="text-[#A7A7A7] h-4 w-4" />
      </SelectTrigger>
      <SelectContent className="bg-bgColor">
        <SelectGroup className="text-[#3C3C3C] font-medium text-base">


        {subCategories.map((item) => (
            <SelectItem className="text-[#3C3C3C] font-medium text-base cursor-pointer" key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
          
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>


    <div className="flex flex-row w-full items-center justify-between gap-10 ">
      <label className='text-[#A7A7A7] capitalize font-medium text-nowrap text-lg' htmlFor="email">Description :</label>
      <Input className="w-[75%] placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-sm border-[#A7A7A7] px-3 " type="email" id="email" placeholder="description" />
    </div>


    <div className="flex flex-row w-full justify-between gap-8 items-baseline">
      <label className='text-[#A7A7A7] capitalize font-medium text-nowrap text-lg justify-end ' htmlFor="email">upload image :</label>
      {/* <Input className="w-[75%] placeholder:text-[#3C3C3C] placeholder:font-medium placeholder:text-sm border-[#A7A7A7] px-3 " type="file" id="email" placeholder="Email" /> */}





      <div className="flex items-center w-[75%] text-left">
        {selectedImage && (
          <img src={selectedImage} alt="Preview" className="w-24 h-24 object-cover rounded-md border border-gray-300" />
        
        )}

      
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />

        {/* Custom Upload Button */}
         <label
          htmlFor="fileInput"
          className="cursor-pointer flex items-center justify-center w-[115px] h-[84px]    rounded-md bg-white hover:bg-gray-100 transition"
        >
         <img src="/img5.png" 
         className="w-full relative h-full object-contain " alt="" />
          <img src="/model.png" 
         className="w-9 absolute h-9 object-cover " alt="" />
          </label>
          </div>
           
    </div>
    
 </div>
   

 <DialogFooter className="flex items-center justify-end flex-row">
          
            <Button type="button" className="px-6 bg-buttonColor text-sm font-medium text-bgColor uppercase">
              Add
            </Button>
            <DialogClose asChild>
            <Button className="text-[#3C3C3C] bg-[#EEEEEE] text-sm font-medium uppercase px-3" type="button">
              Discard
            </Button>
          </DialogClose>
        </DialogFooter>
  </DialogContent>
</Dialog>
   
  )
}

export default AddProduct








  );
};

export default Sample;


import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setPublicId, setState }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setState((prev) => [...prev, result.info.secure_url]);
          }
        }
      );

      document.getElementById("upload_widget").addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };







// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { BsChevronRight } from "react-icons/bs";
import Filter from '../../components/Filter';
import AddCategory from '../../components/AddCategory';
import AddSubCategory from '../../components/AddSubCategory';
import AddProduct from '../../components/AddProduct';
import { apiRequest } from '../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsFailed, ProductsStart, ProductsSuccess } from '../../redux/productSlice';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { allProducts: products } = useSelector((state) => state.product);
  const { searchTerm } = useSelector((state) => state.search);

  const dispatch = useDispatch();

  // Local state for filters
  const [filters, setFilters] = useState({
    subCategory: [],
    search: searchTerm,
    page: 1,
    limit: 50,
  });

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(ProductsStart());
      try {
        const queryString = new URLSearchParams({
          ...filters,
          subCategory: filters.subCategory.length ? filters.subCategory.join(",") : "",
          search: searchTerm, // Include search term in the API request
        }).toString();
        const response = await apiRequest.get(`/product?${queryString}`);
        dispatch(ProductsSuccess(response.data));
      } catch (err) {
        dispatch(ProductsFailed(err.message || "Error fetching products"));
        console.error(err.message);
      }
    };

    fetchProducts();
  }, [dispatch, filters, searchTerm]);

  // Handle checkbox changes for multi-select filters
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;

    setFilters((prevFilters) => {
      const updatedSubCategories = checked
        ? [...prevFilters.subCategory, value]
        : prevFilters.subCategory.filter((item) => item !== value);

      return {
        ...prevFilters,
        subCategory: updatedSubCategories,
      };
    });
  };

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/category');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while fetching categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full px-12 flex flex-row gap-6'>
      <div className='xl:w-[25%] hidden xl:flex flex-col pt-10'>
        <div className='flex flex-row gap-6 h-8 items-center'>
          <span className='font-medium text-base font-poppins'>Home</span>
          <BsChevronRight className='font-medium text-[#292D32] text-xl' />
        </div>
        <Filter
          data={categories}
          subCategoryfilter={handleCheckboxChange}
          selectedSubCategories={filters.subCategory}
        />
      </div>

      <div className='w-full xl:w-[75%] flex-col flex gap-7'>
        <div className='pt-6 flex flex-row w-full gap-7 items-end justify-end'>
          <AddCategory />
          <AddSubCategory data={categories} />
          <AddProduct />
        </div>

        <div className="
          pt-2 grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6
          gap-6
        ">
          {Array.isArray(products) && products.map((listing) => (
            <ProductCard key={listing.id} data={listing} wishlist={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;









export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const { subCategory = [], search = "" } = req.query;

  let filters = {};

  // Handle subcategory filter
  if (subCategory.length) {
    filters.subCategory = { $in: subCategory.split(",") };
  }

  // Handle search filter
  if (search.length) {
    const regEx = new RegExp(search, "i");
    filters.$or = [{ name: regEx }, { description: regEx }]; // Search in name or description
  }

  try {
    const products = await Product.find(filters)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(filters);
    const hasMore = page * limit < totalProducts;

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};


// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { BsChevronRight } from "react-icons/bs";
import Filter from '../../components/Filter';
import AddCategory from '../../components/AddCategory';
import AddSubCategory from '../../components/AddSubCategory';
import AddProduct from '../../components/AddProduct';
import { apiRequest } from '../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsFailed, ProductsStart, ProductsSuccess } from '../../redux/productSlice';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { allProducts: products } = useSelector((state) => state.product);
  const { searchTerm } = useSelector((state) => state.search);

  const dispatch = useDispatch();

  // Local state for filters
  const [filters, setFilters] = useState({
    subCategory: [],
    search: searchTerm,
    page: 1,
    limit: 50,
  });

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(ProductsStart());
      try {
        const queryString = new URLSearchParams({
          ...filters,
          subCategory: filters.subCategory.length ? filters.subCategory.join(",") : "",
          search: searchTerm, // Include search term in the API request
        }).toString();
        const response = await apiRequest.get(`/product?${queryString}`);
        dispatch(ProductsSuccess(response.data));
      } catch (err) {
        dispatch(ProductsFailed(err.message || "Error fetching products"));
        console.error(err.message);
      }
    };

    fetchProducts();
  }, [dispatch, filters, searchTerm]);

  // Handle checkbox changes for multi-select filters
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;

    setFilters((prevFilters) => {
      const updatedSubCategories = checked
        ? [...prevFilters.subCategory, value]
        : prevFilters.subCategory.filter((item) => item !== value);

      return {
        ...prevFilters,
        subCategory: updatedSubCategories,
      };
    });
  };

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/category');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while fetching categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full px-12 flex flex-row gap-6'>
      <div className='xl:w-[25%] hidden xl:flex flex-col pt-10'>
        <div className='flex flex-row gap-6 h-8 items-center'>
          <span className='font-medium text-base font-poppins'>Home</span>
          <BsChevronRight className='font-medium text-[#292D32] text-xl' />
        </div>
        <Filter
          data={categories}
          subCategoryfilter={handleCheckboxChange}
          selectedSubCategories={filters.subCategory}
        />
      </div>

      <div className='w-full xl:w-[75%] flex-col flex gap-7'>
        <div className='pt-6 flex flex-row w-full gap-7 items-end justify-end'>
          <AddCategory />
          <AddSubCategory data={categories} />
          <AddProduct />
        </div>

        <div className="
          pt-2 grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6
          gap-6
        ">
          {Array.isArray(products) && products.map((listing) => (
            <ProductCard key={listing.id} data={listing} wishlist={true} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;  




//pgination

import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import ProductCard from '../../components/ProductCard';
import { BsChevronRight } from "react-icons/bs";
import Filter from '../../components/Filter';
import AddCategory from '../../components/AddCategory';
import AddSubCategory from '../../components/AddSubCategory';
import AddProduct from '../../components/AddProduct';
import { apiRequest } from '../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsFailed, ProductsStart, ProductsSuccess } from '../../redux/productSlice';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { allProducts: products, pagination } = useSelector((state) => state.product);
  const { searchTerm } = useSelector((state) => state.search);

  const dispatch = useDispatch();

  // Local state for filters
  const [filters, setFilters] = useState({
    subCategory: [],
    search: searchTerm,
    page: 1,
    limit: 10,
  });

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(ProductsStart());
      try {
        const queryString = new URLSearchParams({
          ...filters,
          subCategory: filters.subCategory.length ? filters.subCategory.join(",") : "",
          search: searchTerm, 
        }).toString();
        const response = await apiRequest.get(`/product?${queryString}`);
        dispatch(ProductsSuccess(response.data));
      } catch (err) {
        dispatch(ProductsFailed(err.message || "Error fetching products"));
        console.error(err.message);
      }
    };

    fetchProducts();
  }, [dispatch, filters, searchTerm]);

  // Handle checkbox changes for multi-select filters
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;

    setFilters((prevFilters) => {
      const updatedSubCategories = checked
        ? [...prevFilters.subCategory, value]
        : prevFilters.subCategory.filter((item) => item !== value);

      return {
        ...prevFilters,
        subCategory: updatedSubCategories,
      };
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
    }));
  };

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/category');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while fetching categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full px-12 flex flex-row gap-6'>
      <div className='xl:w-[25%] hidden xl:flex flex-col pt-10'>
        <div className='flex flex-row gap-6 h-8 items-center'>
          <span className='font-medium text-base font-poppins'>Home</span>
          <BsChevronRight className='font-medium text-[#292D32] text-xl' />
        </div>
        <Filter
          data={categories}
          subCategoryfilter={handleCheckboxChange}
          selectedSubCategories={filters.subCategory}
        />
      </div>

      <div className='w-full xl:w-[75%] flex-col flex gap-7'>
        <div className='pt-6 flex flex-row w-full gap-7 items-end justify-end'>
          <AddCategory />
          <AddSubCategory data={categories} />
          <AddProduct />
        </div>

        <div className="
          pt-2 grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6
          gap-6
        ">
          {Array.isArray(products) && products.map((listing) => (
            <ProductCard key={listing.id} data={listing} wishlist={true} />
          ))}
        </div>

        {/* Pagination Controls */}
        {pagination && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;



<img
        src="/mail.png" // Replace with your image path
        alt="Email Icon"
        className="absolute object-contain left-6 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
              <Input name="email"
        type="email"
        onChange={handleChange}
        placeholder=" Email" className="bg-inputGreen border-none rounded-none text-xs py-6 font-semibold gap-12 placeholder:pl-8"
              />

