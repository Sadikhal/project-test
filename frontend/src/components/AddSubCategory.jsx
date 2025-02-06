import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dailog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronDown } from 'lucide-react';
import { apiRequest } from '../lib/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { useSelector } from 'react-redux';

const AddSubCategory = ({ data }) => {
  const initialFormData = {
    name: '',
    categoryId: '', 
  }
  const [formData, setFormData] = useState(initialFormData);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {toast} = useToast();



  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle category selection
  const handleCategorySelect = (value) => {
    setFormData({
      ...formData,
      categoryId: value, 
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to add a product.',
      });
      return; // Stop submission if not authenticated
    }
    setIsLoading(true);
    if (!formData.name || !formData.categoryId) {
      setError('Please enter a subcategory name and select a category.');
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: error
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await apiRequest.post('/subCategory', {...formData});  
      toast({
        variant: 'primary',
        description: 'Sub category added successfully',
      });
      setFormData(initialFormData)
    } catch (error) {
      const errorMsg = err.response?.data?.message || "There was a problem with your request";
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog className="max-w-sm">
      <DialogTrigger>
        <Button variant="secondary" size="base">Add Sub Category</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center max-w-xs pt-10">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="font-semibold text-lg text-[#3C3C3C]">Add Subcategory</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex pt-3 items-center justify-center flex-col gap-3 w-full">

            {/* Category Select */}
            <Select onValueChange={handleCategorySelect}>
              <SelectTrigger className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-[1.5px] border-[#3C3C3C73] px-3 w-64 rounded-xl flex flex-row justify-between  py-[22px]">
                <SelectValue placeholder="Select category" />
                <ChevronDown className="text-[#A7A7A7] h-4 w-4" />
              </SelectTrigger>
              <SelectContent className="bg-bgColor">
                <SelectGroup>
                  {data.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Subcategory Name Input */}
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter subcategory name"
              className="outline-none placeholder:text-[#A7A7A7] placeholder:text-xs focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-[#3C3C3C] px-3 border-[1.5px] border-[#3C3C3C73] px-3 w-64 rounded-xl  py-[22px]"
            />
          </div>
          <DialogFooter className="flex items-center justify-center gap-2 mt-4">
            <Button type="submit" disabled={isLoading} className="px-6 bg-buttonColor text-sm font-medium text-bgColor uppercase">
              {isLoading ? 'Loading...' : 'Add'}
            </Button>
            <DialogClose asChild>
              <Button className="text-[#3C3C3C] bg-[#EEEEEE] text-sm font-medium uppercase" type="button">
                Discard
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubCategory;
