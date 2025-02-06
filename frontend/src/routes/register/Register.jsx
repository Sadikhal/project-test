import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { loginFailure, loginStart, loginSuccess } from '../../redux/userSlice';
import { apiRequest } from '../../lib/apiRequest';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/ui/use-toast';

function Register() {
  // Redux State
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Local State
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  // Handle input changes
  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!user.name || !user.email || !user.password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all the fields before submitting.',
      });
      return; // Stop execution if validation fails
    }

    dispatch(loginStart());

    try {
      const res = await apiRequest.post('/auth/register', user);
      dispatch(loginSuccess(res.data));

      toast({
        variant: 'primary',
        description: 'You are successfully registered!',
      });

      navigate('/login'); // Redirect to login page
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';

      dispatch(loginFailure(errorMessage));
      console.error(errorMessage);

      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    }
  };

  return (
    <div className='w-full xl:h-screen flex items-center justify-center'>
      <div className='xl:w-[70%] w-80 sm:w-96 md:w-[50%] xl:h-[90%] flex flex-col xl:flex-row shadow-2xl pt-4 xl:pt-0 py-8 xl:py-0'>

        {/* Left Section - Welcome Back */}
        <div
          style={{ backgroundImage: "url('/bg.jpg')" }}
          className='bg-cover rounded-l-lg flex items-center justify-center xl:w-[40%] xl:h-full bg-no-repeat aspect-square'
        >
          <div className='flex flex-col gap-3 w-[80%] text-center'>
            <h2 className='font-bold text-bgColor text-[28px] md:text-[33px]'>Welcome Back!</h2>
            <p className='text-bgColor/75 text-[15px] md:text-base'>
              To keep connected with us, please login with your personal info.
            </p>
            <div className='pt-8'>
              <Button asChild variant="outline" className='text-bgColor uppercase' size="xl">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className='flex items-center justify-center xl:w-[60%] w-full px-4 xl:px-0'>
          <div className='flex flex-col w-full gap-5 xl:gap-10 text-center'>
            <h2 className='font-bold text-buttonColor md:text-4xl text-2xl pt-8 xl:pt-32'>Create Account</h2>

            <form onSubmit={handleSubmit} className='w-full'>
              <div className='flex flex-col items-center gap-4'>

                {/* Name Input */}
                <div className="relative w-full max-w-[352px]">
                  <img
                    src="/user.png"
                    alt="User Icon"
                    className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-opacity duration-300 ${
                      user.name ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <Input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="bg-inputGreen border-none text-xs py-6 font-semibold placeholder:pl-8 pl-4"
                  />
                </div>

                {/* Email Input */}
                <div className="relative w-full max-w-[352px]">
                  <img
                    src="/mail.png"
                    alt="Email Icon"
                    className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-opacity duration-300 ${
                      user.email ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="bg-inputGreen border-none text-xs py-6 font-semibold placeholder:pl-8 pl-4"
                  />
                </div>

                {/* Password Input */}
                <div className="relative w-full max-w-[352px]">
                  <img
                    src="/lock.png"
                    alt="Password Icon"
                    className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-opacity duration-300 ${
                      user.password ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <Input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="bg-inputGreen border-none text-xs py-6 font-semibold placeholder:pl-8 pl-4"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className='pt-6'>
                <Button
                  type="submit"
                  className="rounded-full bg-buttonColor hover:bg-buttonColor/80 text-bgColor"
                  size="xl"
                >
                  {loading ? 'Loading...' : 'Sign Up'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
