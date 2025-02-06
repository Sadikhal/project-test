import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 4 && i <= currentPage + 4)) {
      pages.push(i);
    } else if (i === currentPage - 5 || i === currentPage + 5) {
      pages.push("....");
    }
  }

  return (
    <div className="flex items-center space-x-2 ">
      
     <div className="flex flex-row gap-1">
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => page !== "...." && onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center font-figtree font-semibold rounded-full text-sm ${
            page === currentPage
              ? "bg-[#F5A623] text-white font-semibold"
              : " text-[#F5A623]"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
    </div>
  );
};

export default Pagination;
