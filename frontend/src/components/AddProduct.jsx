


import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dailog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronDown } from 'lucide-react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { apiRequest } from '../lib/apiRequest';
import ImageCropModal from './ImageCropper';
import { cn } from '../lib/utils';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const AddProduct = ({ title }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [selectedRam, setSelectedRam] = useState([]);
    const {toast} = useToast()
    const { currentUser } = useSelector((state) => state.user);
  
  const initialFormData = {
    name: '',
    subCategory: '',
    desc: '',
    variants: [],
    image: [],
  }
  // State Management
  const [formData, setFormData] = useState(initialFormData);

  // Image cropping states
  const [cropQueue, setCropQueue] = useState([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const ramOptions = [4, 8];
  const maxQuantity = 100;

  const [variants, setVariants] = useState(
    ramOptions.map((ram) => ({
      ram,
      price: '',
      quantity: 1,
    }))
  );

  // get SUB Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest.get('/subCategory');
        setSubCategories(response.data);
      } catch (error) {
        console.error(error);
        setError('Something went wrong while fetching categories.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  //IMAGE UPLOADING
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (formData.image.length + files.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      return;
    }
    setCropQueue(prev => [...prev, ...files]);
    setIsCropModalOpen(true);
  };

  const handleCroppedImage = (url) => {
    setFormData(prev => ({
      ...prev,
      image: [...prev.image, url]
    }));
    setCropQueue(prev => prev.slice(1));
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubCategoryChange = (value) => {
    setFormData({ ...formData, subCategory: value });
  };
// RAM SELECTION
  const handleRamSelect = (ram) => {
    setSelectedRam((prevSelected) =>
      prevSelected.includes(ram) ? prevSelected.filter((item) => item !== ram) : [...prevSelected, ram]
    );
  };

  //QUANTITY CHANGE HANDLERS
  const handleQuantityChange = (index, type) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              quantity:
                type === 'increment'
                  ? Math.min(variant.quantity + 1, maxQuantity)
                  : Math.max(variant.quantity - 1, 1),
            }
          : variant
      )
    );
  };

  //PRICE CHANGE HANDLERS

  const handlePriceChange = (index, value) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) => (i === index ? { ...variant, price: value } : variant))
    );
  };


  //SUBMISSION  HANDLING
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to add a product.',
      });
      return; // Stop submission if not authenticated
    }
    // Filter variants based on selected RAM
    const filteredVariants = variants.filter((variant) => selectedRam.includes(variant.ram));
    // Check if any field is empty

    if (filteredVariants.length === 0  || !formData.desc || !formData.name || !formData.image || !formData.subCategory ) {
     toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all the fields before submitting.',
      });
      return;
    }

    const productData = {
      ...formData,
      variants: filteredVariants,
    };
// data submission
    try {
      const response = await apiRequest.post('/product', productData);
      toast({
        variant: 'primary',
        description: 'product is successfully uploaded',
      });
      setFormData(initialFormData);
      setLoading(false);
      window.location.reload();
    } catch (error) {
        const errorMessage = error.response?.data?.message  || "There was a problem with your request.";
        toast({
          variant: 'destructive',
          title: "Uh oh! Something went wrong.",
          description: errorMessage 
        });
      }
      
  };

  return (
    <Dialog className="w-full">
      <DialogTrigger>
        <Button
          variant="secondary"
          className={cn(
            "text-sm font-poppins font-semibold h-11 lg:px-4 lg:py-4 md:px-3 md:py-3 px-2 py-2",
            title === "Edit" && "lg:px-12 px-8 md:px-12"
          )}
        >
          {title} product
        </Button>
      </DialogTrigger>

      <DialogContent className="px-4 lg:px-12 lg:w-[63%]">
        <DialogHeader className="flex items-center justify-center py-6">
          <DialogTitle className="font-semibold text-xl text-[#3C3C3C]">Add Product</DialogTitle>
        </DialogHeader>

        {/* Form Sections */}
        <div className="flex flex-col gap-5">
          {/* Title Input */}
          <div className="flex flex-row w-full items-center justify-between gap-10">
            <label className="text-[#A7A7A7] capitalize font-medium text-lg">Title:</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-[75%] pl-2"
              placeholder="Title"
            />
          </div>

          {/* Variants Section */}
          <div className="flex flex-row w-full justify-between gap-10">
            <label className="text-[#A7A7A7] capitalize font-medium text-lg">Variants:</label>
            <div className="flex flex-col gap-1 w-[75%]">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center w-full justify-between gap-3 ">
                  {/* RAM Selection */}
                  <div className="flex gap-2 items-center flex-1">
                    <div className='text-[#A7A7A7] font-medium text-sm py-3 font-montserrat'>Ram:</div>
                    <Button
                      onClick={() => handleRamSelect(variant.ram)}
                      className={`p-2 border text-[#3C3C3C] w-full font-medium text-sm text-left flex justify-start rounded-lg ${
                        selectedRam.includes(variant.ram) ? 'border-2 border-gray-500' : 'border-[#A7A7A7]'
                      }`}
                    >
                      {variant.ram} GB
                    </Button>
                  </div>

                  {/* Price Input */}
                  <div className="flex gap-2 items-center flex-1">
                    <div className='text-[#A7A7A7] font-medium text-sm py-3 font-montserrat'>Price:</div>
                    <Input
                      className="p-2 border text-[#3C3C3C] border-[#A7A7A7] font-medium text-sm rounded-lg w-full"
                      type="number"
                      value={variant.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="Price"
                    />
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex gap-2 items-center px-2 lg:pr-4 flex-1">
                    <div className='text-[#A7A7A7] font-medium text-sm py-3 font-montserrat'>QTY:</div>
                    <div className="border border-[#A7A7A7] w-full py-[5px] flex items-center justify-between rounded-lg px-1">
                      <GoChevronLeft
                        onClick={() => handleQuantityChange(index, 'decrement')}
                        className="cursor-pointer text-[#A7A7A7] text-3xl"
                      />
                      <span>{variant.quantity}</span>
                      <GoChevronRight
                        onClick={() => handleQuantityChange(index, 'increment')}
                        className="cursor-pointer text-[#A7A7A7] text-3xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategory Selection */}
          <div className="flex flex-row w-full items-center justify-between gap-10">
            <label className="text-[#A7A7A7] font-medium text-lg">Sub Category:</label>
            <Select onValueChange={handleSubCategoryChange}>
              <SelectTrigger className="w-[75%] pl-2 placeholder:text-[#A7A7A7] text-black">
                <SelectValue placeholder="Select category" className='placeholder:text-[#A7A7A7] text-black' />
                <ChevronDown />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className='bg-bgColor '>
                  {subCategories.map((item) => (
                    <SelectItem className="placeholder:text-[#A7A7A7] text-black" key={item._id} value={item._id}>{item.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="flex flex-row w-full items-center justify-between gap-10">
            <label className="text-[#A7A7A7] capitalize font-medium text-lg">Description:</label>
            <Input
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              className="w-[75%] pl-2"
              placeholder="Description"
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-row w-full justify-between gap-8 items-baseline">
            <label className="text-[#A7A7A7] capitalize font-medium text-nowrap text-lg justify-end">
              Upload image:
            </label>
            <div className='flex items-center w-[75%] text-left gap-4'>
              <div className="flex flex-row gap-5">
                {formData.image.map((image, index) => (
                  <div className='border p-2 rounded-lg' key={index}>
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-24 h-20 object-cover rounded-md border border-gray-300" 
                    />
                  </div>
                ))}
              </div>
              <input
                type="file"
                id='fileInput'
                multiple
                className='hidden'
                required
                onChange={handleImageUpload}
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex items-center justify-center w-[115px] h-[84px] rounded-md bg-white hover:bg-gray-100 transition"
              >
                <img src="/img5.png" className="w-full relative h-full object-contain" alt="" />
                <img src="/model.png" className="w-9 absolute h-9 object-cover" alt="" />
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-buttonColor text-bgColor px-6 py-0 uppercase">
            {title}
          </Button>
          <DialogClose asChild>
            <Button className="bg-[#EEEEEE] px-5 uppercase">Discard</Button>
          </DialogClose>
        </DialogFooter>

        {/* Image Crop Modal */}
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          onUploadComplete={handleCroppedImage}
          queue={cropQueue}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;