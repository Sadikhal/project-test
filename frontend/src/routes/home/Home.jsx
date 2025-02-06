import React, { useEffect, useState } from 'react'; 
import ProductCard from '../../components/ProductCard';
import { BsChevronRight } from "react-icons/bs";
import Filter from '../../components/Filter';
import AddCategory from '../../components/AddCategory';
import AddSubCategory from '../../components/AddSubCategory';
import AddProduct from '../../components/AddProduct';
import { apiRequest } from '../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsFailed, ProductsStart, ProductsSuccess } from '../../redux/productSlice';
import Pagination from '../../components/Pagination';  
import { FaAngleDown, FaChevronUp } from 'react-icons/fa6';
import MobileFilter from '../../components/MobileFilter';

function Home() {
  const dispatch = useDispatch();
  
  // Redux State
  const { allProducts: products, pagination } = useSelector((state) => state.product);
  const { searchTerm } = useSelector((state) => state.search);
  

  // Local State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    subCategory: [],
    search: searchTerm,
    page: 1,
    limit: 10,
  });

  // Toggle product limit (10 or 20)
  const handleLimitToggle = () => {
    setFilters(prev => ({
      ...prev,
      limit: prev.limit === 10 ? 20 : 10,
      page: 1, // Reset to first page when changing limit
    }));
  };

  // Fetch Products based on filters
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

  // Handle checkbox change for subcategories
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      subCategory: checked 
        ? [...prevFilters.subCategory, value]
        : prevFilters.subCategory.filter((item) => item !== value),
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
      limit: 10,
    }));
  };

  // Fetch Categories
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
    <div className='w-full md:px-7 lg:px-12 flex px-3 sm:px-4 flex-row gap-6'>
      

      {/* Sidebar - Categories and Filters */}
      <div className='lg:w-[23%] flex flex-col pt-10'>
        {/* Breadcrumb Navigation */}
        <div className='flex-row hidden lg:flex gap-6 h-8 items-center'>
          <span className='font-medium text-base font-poppins'>Home</span>
          <BsChevronRight className='font-medium text-[#292D32] text-xl' />
        </div>

        {/* Desktop Filter */}
        <div className="lg:flex hidden">
          <Filter
            data={categories}
            subCategoryfilter={handleCheckboxChange}
            selectedSubCategories={filters.subCategory}
          />
        </div>

        {/* Mobile Filter */}
        <MobileFilter 
          data={categories}
          subCategoryfilter={handleCheckboxChange}
          selectedSubCategories={filters.subCategory}
        />
      </div>

      {/* Main Content - Products and Controls */}
      <div className='w-full lg:w-[75%] flex-col flex gap-7'>

        {isLoading ? (
          <p className="text-center py-10">Loading...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <>

        {/* Add Buttons for Categories, Subcategories, and Products */}
        <div className='pt-6 flex flex-row w-full md:gap-7 gap-3 items-end justify-end'>
          <AddCategory />
          <AddSubCategory data={categories} />
          <AddProduct title="Add"/>
        </div>

        {/* Product Grid */}
        <div className="
          pt-2 grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
          gap-6
        ">
          {Array.isArray(products) && products.map((listing) => (
            <ProductCard key={listing.id} data={listing} wishlist={true} />
          ))}
        </div>

        {/* Pagination and Item Limit Controls */}
        <div className='h-16'>
          <div className='flex flex-row justify-between w-full items-center h-full'>
            
            {/* Items Count */}
            <div className='text-[#747474] font-figtree text-base font-normal hidden sm:flex'>
              {filters.limit} of {pagination.totalProducts} items
            </div>

            {/* Pagination Component */}
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Show More / Less Rows */}
            <div className='flex items-center justify-end gap-4 h-full'>
              <div className='font-figtree text-base hidden sm:flex font-normal text-[#747474] capitalize'>
                show
              </div>
              <div className='space-x-3 flex flex-row items-center cursor-pointer' onClick={handleLimitToggle}>
                <span className='font-figtree text-base text-buttonColor font-semibold  text-nowrap'>
                  {filters.limit === 10 ? '10 more rows' : 'Show less'}
                </span>
                <span>
                  {filters.limit === 10 ? (
                    <FaAngleDown className="text-[#747474]" />
                  ) : (
                    <FaChevronUp className="text-[#747474]" />
                  )}
                </span>
              </div>
            </div>

          </div>
        </div>
        </>
        )}
      </div>
    

    </div>
  );
}

export default Home;
