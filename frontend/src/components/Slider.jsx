import React, { useState } from 'react';


const Slider = ({images}) => {
   const [activeImage, setActiveImage] = useState(images[0]);
    const [imageIndex, setImageIndex] = useState(null);
  
  return (
    <div className='flex flex-col p-3 lg:pr-12  w-full gap-4'>
       <div className="w-full p-5 aspect-square max-h-[400px] cursor-pointer rounded-xl border-[#ACACAC] border-[1.25px] flex items-center justify-center">
        <img src={activeImage} alt="" className="w-full object-contain max-h-56 " onClick={() => setImageIndex(0)} />
      </div>
      <div className="flex-3 flex flex-row  gap-6  ">
        {images.map((image, index) => (
          <div className='cursor-pointer rounded-xl border-[#ACACAC]  border-[1.25px] flex items-center justify-center py-2 flex-1'>
          <img
            src={image}
            alt="img"
            key={index}
            className=" object-contain max-h-[84px] xl:min-h-24"
            onClick={() => setActiveImage(image)}
            
          />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Slider