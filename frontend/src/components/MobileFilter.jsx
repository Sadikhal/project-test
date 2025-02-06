import { GiHamburgerMenu } from "react-icons/gi";
import Filter from './Filter';
import { BsChevronRight } from 'react-icons/bs';
import { SheetTrigger,Sheet, SheetContent, } from "./ui/sheet";
const MobileFilter = ({data,subCategoryfilter,selectedSubCategories}) => {
  return (
    <div className='flex lg:hidden'>
      <Sheet className="h-full p-12 w-96">
        <SheetTrigger className="-mt-2">
          <div size={40} className=" text-lamateal text-[24px] px-2">
          <GiHamburgerMenu className="text-navColor" />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#fff] overflow-y-scroll "  side="leftFilter">

         <div className='flex flex-col pt-10'>
        <div className='flex flex-row gap-6 h-8 items-center'>
          <span className='font-medium text-base font-poppins'>Home</span>
          <BsChevronRight className='font-medium text-[#292D32] text-xl' />
        </div>
        <div className="">
        <Filter 
          data={data}
          subCategoryfilter={subCategoryfilter}
          selectedSubCategories={selectedSubCategories}
        />
        </div>
        
      </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilter;
