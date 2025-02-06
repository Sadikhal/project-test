import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { apiRequest } from '../../lib/apiRequest';
import { useToast } from '../../components/ui/use-toast';

function Login() {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState({ 
    email: '', 
    password: '' 
  });


  
  // * handleChange updates the corresponding field in the user state object.
  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  
  // handleSubmit prevents the default form submission behavior, validates the input fields,
  //   and sends a registration request to the server.


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all the fields before submitting.',
      });
      return;
    }
    
    dispatch(loginStart());
    try {
      const res = await apiRequest.post('/auth/login', user);
      dispatch(loginSuccess(res.data));
      toast({
        variant: 'primary',
        description: 'You are successfully login!',
      });
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message));
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'please try again with valid email and password'
      });
    }
  };

  return (
    <div className='w-full xl:h-screen flex items-center justify-center'>
      <div className='xl:w-[60%] w-80 sm:w-96 md:w-[40%] xl:h-[90%] justify-center items-center h-full text-center flex flex-col-reverse xl:flex-row shadow-2xl xl:mb-0 mt-2 mb-4 xl:mt-0 py-8 xl:py-0'>
        <form onSubmit={handleSubmit} className='flex justify-center items-center '>
          <div className='flex justify-center items-center xl:w-[85%] w-full xl:pr-6 pr-2'>
            <div className='flex justify-center text-center w-full flex-col gap-5 xl:gap-8 items-center'>
              <div className='font-bold capitalize md:leading-10 text-buttonColor md:text-[33px] xl:w-[70%] text-2xl pt-8 xl:pt-16'>
                Sign In to Your Account
              </div>
              <div className='w-full flex justify-center items-center flex-col'>
                <div className='font-normal w-full items-center justify-center gap-2 text-base flex flex-col xl:w-[90%] '>
                  {/* Email Input */}
                  <div className="flex w-full max-w-[352px] items-center relative space-x-2">
                    <img
                      src="/mail.png"
                      alt="Email Icon"
                      className={`absolute object-contain left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-opacity duration-300 ${
                        user.email ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <Input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="bg-inputGreen border-none rounded-none text-xs py-6 font-semibold placeholder:pl-8 gap-12 pl-4"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="flex w-full max-w-[352px] items-center relative space-x-2">
                    <img
                      src="/lock.png"
                      alt="Password Icon"
                      className={`absolute left-6 object-contain top-1/2 transform -translate-y-1/2 w-5 h-5 transition-opacity duration-300 ${
                        user.password ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <Input
                      type="password"
                      name="password"
                      value={user.password}
                      placeholder="Password"
                      onChange={handleChange}
                      className="bg-inputGreen border-none rounded-none text-xs py-6 font-semibold placeholder:pl-8 gap-12 pl-4"
                    />
                  </div>
                </div>
                <div className='pt-2 flex flex-col gap-5 justify-center items-center'>
                  <button className="underline-offset-2 pt-2 text-textBlack underline font-bold text-sm">
                    <Link to="/register">
                      Forgotten password?
                    </Link>
                  </button>
                  <Button
                    className="rounded-full w-56 py-6 bg-buttonColor uppercase hover:bg-buttonColor/80 text-bgColor"
                    type="submit"
                    size="xl"
                  >
                    {loading ? 'Loading...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div 
          style={{ backgroundImage: "url('/bg.jpg')" }} 
          className='bg-cover xl:max-h-none max-h-96 xl:h-full justify-center items-center text-center flex xl:w-[40%] h-full bg-no-repeat aspect-square rounded-t-lg xl:rounded-t-none '
        >
          <div className='flex justify-center flex-col gap-3 w-[80%]'>
            <div className='font-bold capitalize text-bgColor text-[28px] md:text-[33px]'>Hello friend!</div>
            <div className='font-normal text-[15px] md:text-base text-bgColor/75'>
              Enter your personal details and start your journey with us
            </div>
            <div className='pt-8'>
              <Button asChild variant="outline" size="xl">
                <Link to="/register" className='text-bgColor uppercase'>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;