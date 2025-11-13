import React, { useState, useContext } from 'react';
import BgItems from '../assets/Js/BgItems';
import { Form, Input, Button } from '@heroui/react';
import Icons from '../assets/Js/Icons';
import SwiperImage from '../components/swiper/Swiper';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await login(data.username, data.password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="relative w-screen h-screen items-center justify-center flex flex-col">
      <div className="h-1/2 w-full bg-white"></div>
      <div className="h-1/2 w-full bg-BackgroundColor"></div>
      <img src={BgItems.KlassmateLogo} alt="Klassmate Logo" className="absolute top-[80px] w-2/5 md:w-1/3" />

      <div className="absolute bg-white rounded-2xl drop-shadow-lg w-[96%] lg:w-2/4 h-3/5 border-[1px] mt-10">
        <div className="flex justify-between w-full h-full">
          <div className="w-1/2 h-full rounded-l-2xl p-10 flex justify-center flex-col">
            <div className="flex justify-center mb-10">
              <p className="font-semibold text-xl">Electronic Meter Login</p>
            </div>

            <Form 
              className="flex flex-col gap-4" 
              onReset={() => setError('')} 
              onSubmit={handleSubmit}>
              <div className="flex -mb-[12px]">
                <label className="text-black font-normal text-sm">Username</label>
                <p className="text-red-600 text-sm">*</p>
              </div>
              <Input
                isRequired
                errorMessage="Please enter a valid username"
                name="username"
                placeholder="Enter your username"
                type="text"
              />
              <div className="flex -mb-[12px]">
                <label className="text-black font-normal text-sm">Password</label>
                <p className="text-red-600 text-sm">*</p>
              </div>
              <div className="w-full relative">
                <Input
                  isRequired
                  errorMessage="Please enter a valid password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute flex items-center text-gray-500 top-[10px] right-3"
                >
                  {showPassword ? <Icons.OpenEye size={20} /> : <Icons.CloseEye size={20} />}
                </button>
              </div>
              <div className="flex gap-2 justify-end w-full flex-wrap">
                <Button type="reset" variant="flat" className="hidden md:block">
                  Reset
                </Button>
                <Button type="submit" className=" bg-BackgroundColor font-bold text-white">
                  Login
                </Button>
              </div>
              {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}
            </Form>
          </div>

          <div className="w-1/2 h-full bg-slate-200 rounded-r-2xl p-10 flex justify-center items-center flex-col">
            <div className="w-full">
              <SwiperImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;