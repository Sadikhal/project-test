import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dailog';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/apiRequest';
import { useToast } from './ui/use-toast';
import { useSelector } from 'react-redux';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useSelector((state) => state.user);
  // Handles input field changes
  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  // Handles form submission for adding a category
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
    setLoading(true);
    try {
      const response = await apiRequest.post('/category', { name: category });
      toast({
        variant: 'primary',
        description: 'Category added successfully',
      });
      setCategory(''); 
      navigate('/'); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "There was a problem with your request. Please use a different category name.";
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  variant="primary"  size="base">
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col items-center justify-center max-w-xs pt-10">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="font-semibold text-lg text-[#3C3C3C]">
            Add Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex pt-3 items-center justify-center w-full">
            <Input
              id="name"
              name="name"
              value={category}
              onChange={handleChange}
              placeholder="Enter category name"
              className="placeholder:text-[#A7A7A7] placeholder:text-xs py-[22px] border-[1.5px] border-[#3C3C3C73] px-3 w-64 rounded-xl"
            />
          </div>

          <DialogFooter className="flex items-center justify-center flex-row gap-2 mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 bg-buttonColor cursor-pointer text-sm font-medium text-bgColor uppercase"
            >
              {loading ? 'Loading...' : 'Add'}
            </Button>

            <DialogClose asChild>
              <Button
                className="text-[#3C3C3C] bg-[#EEEEEE] text-sm font-medium uppercase"
                type="button"
              >
                Discard
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddCategory;
