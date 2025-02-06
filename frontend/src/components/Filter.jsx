import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const Subcategory = ({ subCategory, subCategoryfilter, selectedSubCategories }) => (
  <div className='flex flex-col gap-3 pt-1'>
    {(subCategory || []).map((i) => (
      <div key={i._id} className='flex flex-row gap-3 items-center pl-4'>
     <input
  type="checkbox"
  id={i._id}
  value={i._id}
  checked={selectedSubCategories.includes(i._id)}
  onChange={(e) => subCategoryfilter(e, "subCategory")}
  className="h-6 w-6 appearance-none rounded-lg border border-[#B3D4E5] bg-[#B3D4E5] bg-[length:8px_8px] bg-center bg-no-repeat checked:border-#3F3F3F] checked:bg-[#3F3F3F] checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNUw0LjUgOUwxMSAxIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==')]"
/>
        <label
          htmlFor={i._id}
          className="font-poppins font-normal text-[#222222] text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
        >
          {i.name}
        </label>
      </div>
    ))}
  </div>
);

const Filter = ({ data, subCategoryfilter, selectedSubCategories }) => {
  return (
    <div className='flex flex-col text-left gap-5 pt-5 w-full'>
      <div className='capitalize font-medium text-base font-poppins text-textColor'>
        Categories
      </div>

      <div className='flex flex-col gap-4'>
        <div className='font-normal capitalize text-base font-poppins text-[#222222]'>
          All Categories
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full bg-bgColor flex flex-col">
            {(data || []).map((item) => (
              <AccordionItem key={item._id} value={item._id} className="bg-bgColor w-full">
                <AccordionTrigger className="font-normal text-[#222222] text-base font-poppins w-full capitalize">
                  {item.name}
                </AccordionTrigger>
                <AccordionContent className="overflow-y-auto">
                  <Subcategory 
                    subCategoryfilter={subCategoryfilter}  
                    selectedSubCategories={selectedSubCategories} 
                    subCategory={item.subCategory || []} 
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Filter;
