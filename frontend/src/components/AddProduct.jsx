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

const AddProduct = ({ title, product }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const { toast } = useToast();
  const { currentUser } = useSelector((state) => state.user);

  const initialFormData = {
    name: '',
    subCategory: '',
    desc: '',
    variants: [],
    image: [],
  }

  const [formData, setFormData] = useState(initialFormData);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest.get('/subCategory');
        setSubCategories(response.data);
      } catch (error) {
        console.error(error);
        setError('Something went wrong while fetching categories.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (title === "Edit" && product) {
      setFormData({
        name: product.name,
        subCategory: product.subCategory?._id || '',
        desc: product.desc,
        image: product.image,
        variants: product.variants,
      });

      const newVariants = ramOptions.map(ram => {
        const existingVariant = product.variants.find(v => v.ram === ram);
        return existingVariant ? 
          { ...existingVariant } : 
          { ram, price: '', quantity: 1 };
      });
      
      setVariants(newVariants);
      setSelectedRam(product.variants.map(v => v.ram));
    }
  }, [product, title]);

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

  const handleRamSelect = (ram) => {
    setSelectedRam((prevSelected) =>
      prevSelected.includes(ram) ? prevSelected.filter((item) => item !== ram) : [...prevSelected, ram]
    );
  };

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

  const handlePriceChange = (index, value) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) => (i === index ? { ...variant, price: value } : variant))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to add a product.',
      });
      return;
    }

    const filteredVariants = variants.filter((variant) => selectedRam.includes(variant.ram));
    
    if (filteredVariants.length === 0 || !formData.desc || !formData.name || !formData.image || !formData.subCategory) {
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

    try {
      let response;
      if (title === "Edit") {
        response = await apiRequest.put(`/product/${product._id}`, productData);
      } else {
        response = await apiRequest.post('/product', productData);
      }

      toast({
        variant: 'primary',
        description: title === "Edit" ? 'Product updated successfully' : 'Product uploaded successfully',
      });

      setFormData(initialFormData);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "There was a problem with your request.";
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
            " font-poppins font-semibold h-11 lg:px-4 lg:py-4 md:px-3 md:py-3 px-2 py-2",
            title === "Edit" && "lg:px-12 px-8 md:px-12"
          )}
        >
          {title} product
        </Button>
      </DialogTrigger>

      <DialogContent className="px-4 lg:px-12 lg:w-[63%] w-[95%] flex flex-col">
        <DialogHeader className="flex items-center justify-center py-6">
          <DialogTitle className="font-semibold text-xl text-[#3C3C3C]">
            {title} Product
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-row w-full items-center justify-between gap-10">
            <label className="text-[#A7A7A7] capitalize font-medium text-base md:text-lg">Title:</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-[75%] pl-2 py-[22px] border-[1.5px] border-[#3C3C3C73]"
              placeholder="Title"
            />
          </div>

          <div className="flex flex-row w-full justify-between gap-2 md:gap-10 items-center md:items-end">
            <label className="text-[#A7A7A7] capitalize font-medium text-base md:text-lg">Variants:</label>
            <div className="flex md:flex-col flex-row gap-1 w-full md:w-[75%] ">
              {variants.map((variant, index) => (
                <div key={index} className="flex md:items-center w-full md:justify-between gap-3 flex-col md:flex-row">
                  <div className="flex gap-2 md:items-center flex-1">
                    <div className='text-[#A7A7A7] font-medium text-xs sm:text-sm py-3 font-montserrat'>Ram:</div>
                    <Button
                      onClick={() => handleRamSelect(variant.ram)}
                      className={`p-2 cursor-pointer border text-[#3C3C3C] w-full font-medium text-xs sm:text-sm text-left flex justify-start rounded-lg ${
                        selectedRam.includes(variant.ram) ? 'border-2 border-gray-500' : 'border-[#A7A7A7]'
                      }`}
                    >
                      {variant.ram} GB
                    </Button>
                  </div>

                  <div className="flex gap-2 items-center flex-1">
                    <div className='text-[#A7A7A7] font-medium text-xs sm:text-sm py-3 font-montserrat'>Price:</div>
                    <Input
                      className="p-2 border cursor-pointer text-[#3C3C3C] border-[#A7A7A7] font-medium text-xs sm:text-sm rounded-lg w-full"
                      type="number"
                      value={variant.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="Price"
                    />
                  </div>

                  <div className="flex gap-2 items-center px-2 lg:pr-4 flex-1">
                    <div className='text-[#A7A7A7] font-medium text-xs sm:text-sm py-3 cursor-pointer font-montserrat'>QTY:</div>
                    <div className="border border-[#A7A7A7] w-full py-[5px] flex items-center justify-between rounded-lg px-1">
                      <GoChevronLeft
                        onClick={() => handleQuantityChange(index, 'decrement')}
                        className="cursor-pointer text-[#A7A7A7] text-3xl"
                      />
                      <span>{variant.quantity}</span>
                      <GoChevronRight
                        onClick={() => handleQuantityChange(index, 'increment')}
                        className="cursor-pointer  text-[#A7A7A7] text-3xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row w-full items-center justify-between  md:gap-10">
            <label className="text-[#A7A7A7] font-medium text-base md:text-lg">Sub Category:</label>
            <Select onValueChange={handleSubCategoryChange} value={formData.subCategory}>
              <SelectTrigger className="w-[75%] pl-2 placeholder:text-[#A7A7A7] text-black py-[22px] border-[1.5px] border-[#3C3C3C73]">
                <SelectValue placeholder="Select category" className='placeholder:text-[#A7A7A7] text-black' />
                <ChevronDown />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className='bg-bgColor '>
                  {subCategories.map((item) => (
                    <SelectItem className="placeholder:text-[#A7A7A7] text-black" key={item._id} value={item._id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row w-full items-center justify-between gap-2 md:gap-10">
            <label className="text-[#A7A7A7] capitalize font-medium text-base md:text-lg">Description:</label>
            <Input
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              className="w-[75%] pl-2 py-[22px] border-[1.5px]  rounded-lg border-[#3C3C3C73]"
              placeholder="Description"
            />
          </div>

          <div className="flex flex-row w-full justify-between gap-3 md:gap-8 items-baseline">
            <label className="text-[#A7A7A7] capitalize font-medium text-nowrap text-base md:text-lg justify-end">
              Upload image:
            </label>
            <div className='flex items-center w-[75%] text-left gap-4'>
              <div className="flex flex-row flex-wrap sm:flex-nowrap gap-5">
                {formData.image.map((image, index) => (
                  <div className='border-[1.5px] border-[#3C3C3C73] p-2 rounded-lg' key={index}>
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-30 h-[86px] object-cover rounded-lg" 
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

        <DialogFooter className="flex flex-col md:flex-row gap-3">
          <Button onClick={handleSubmit} className="bg-buttonColor text-bgColor px-6 py-0 uppercase">
            {title}
          </Button>
          <DialogClose asChild>
            <Button className="bg-[#EEEEEE] px-5 uppercase">Discard</Button>
          </DialogClose>
        </DialogFooter>

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