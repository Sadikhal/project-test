// src/components/Navbar.js
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../../redux/searchSlice';
import { apiRequest } from '../../lib/apiRequest';
import {logout} from '../../redux/userSlice' ;

const Navbar = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const dispatch = useDispatch();
const navigate = useNavigate();
const  {currentUser}  = useSelector((state) => state.user);
  const handleSearch = (e) => {
    navigate("/")
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
  };


  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='bg-navColor justify-between h-20 w-full flex lg:px-0 flex-row px-3'>
      <div className='lg:w-[50%] w-[68%] flex items-center '>
        <div className='w-full text-right justify-end flex items-end'>
          <div className='relative lg:w-[55%] w-full'>
            <input 
              className="placeholder:text-[#292D32] font-normal  placeholder:text-sm text-sm w-full rounded-2xl py-3 lg:pl-9 pl-3 md:pl-5 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm font-poppins bg-bgColor"
              placeholder="Search anything"
              type="text"
              name="search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <button
              className="placeholder:text-bgColor placeholder:text-sm text-sm w-[85px] lg:w-[96px] xl:w-[104px] absolute right-0 bg-buttonColor rounded-2xl py-3 text-center font-semibold shadow-sm focus:bg-buttonColor/80 outline-none focus:outline-none text-bgColor sm:text-sm capitalize font-poppins"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className='lg:w-[50%] justify-center flex items-center'>
        <div className='flex flex-row gap-3 lg:gap-7 text-center xl:pl-24'>
          <div className='flex items-center gap-4 '>
            <Link to="/whislist" className='gap-1 lg:flex flex-row items-center hidden'>
              <img src='/heart.png' className='bg-cover h-6 w-6' alt='wishlist' />
              <span className='h-4 w-4 bg-buttonColor rounded-full text-bgColor text-xs font-normal font-poppins'>1</span>
            </Link>
            {currentUser ? (
  <Button
    onClick={handleLogout}
    className='font-normal text-sm font-poppins hover:bg-[#62a9d575] text-bgColor'
  >
    Log out
  </Button>
) : (
  <button
    onClick={() => navigate('/login')}  // Fixed: Wrapped in arrow function
    className='font-normal text-sm font-poppins hover:bg-[#62a9d575] text-bgColor'
  >
    sign in
  </button>
)}
          
          </div>

          <div className='flex items-center gap-4'>
            <Link to="/whislist" className='gap-1 flex flex-row items-center'>
              <img src='/shopping-cart.png' className='bg-cover h-6 w-6' alt='wishlist' />
              <span className='h-4 w-4 bg-buttonColor rounded-full text-bgColor text-xs font-normal font-poppins'>1</span>
              <div className='font-normal text-sm font-poppins lg:block hidden pl-2 text-bgColor'>
                cart
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;