import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101828] px-4 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full mt-auto">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 max-w-[1440px] mx-auto mb-8 md:mb-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 lg:w-[341px]">
          <div className="text-xl md:text-2xl">
            <span className="font-poppins font-normal text-warning">Skill</span>
            <span className="font-poppins font-bold text-primary">Swap</span>
            <span className="font-poppins font-bold text-warning">.</span>
          </div>
          <div className="font-semibold text-base md:text-lg text-gray">
            <p className="m-0">Exchange skills, build connections, and grow together</p>
          </div>
        </div>
        
        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 font-semibold text-base md:text-lg flex-1">
          {/* Product Column */}
          <div className="flex flex-col gap-4 md:gap-[30px] items-start">
            <h3 className="text-white m-0 text-base md:text-lg font-semibold">Product</h3>
            <div className="flex flex-col gap-2 md:gap-3 items-start w-full">
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Features</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">How it works</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Pricing</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Success Stories</a>
            </div>
          </div>
          
          {/* Company Column */}
          <div className="flex flex-col gap-4 md:gap-[30px] items-start">
            <h3 className="text-white m-0 text-base md:text-lg font-semibold">Company</h3>
            <div className="flex flex-col gap-2 md:gap-3 items-start w-full">
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">About Us</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Careers</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Blog</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Legal Column */}
          <div className="flex flex-col gap-4 md:gap-[30px] items-start col-span-2 sm:col-span-1">
            <h3 className="text-white m-0 text-base md:text-lg font-semibold">Legal</h3>
            <div className="flex flex-col gap-2 md:gap-3 items-start w-full">
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Terms of Service</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray no-underline text-xs sm:text-sm md:text-lg font-semibold hover:text-[#ccc] transition-colors">Guidelines</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="flex flex-col gap-4 items-center py-4 w-full">
        <hr className="w-full max-w-[1440px] border-none border-t border-[#333] m-0" />
        <div className="flex gap-2.5 items-center justify-center text-center">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#999999" strokeWidth="1.5" strokeMiterlimit="10"/>
            <path d="M15 9.5C14.4 8.9 13.5 8.5 12.5 8.5C10.6 8.5 9 10.1 9 12C9 13.9 10.6 15.5 12.5 15.5C13.5 15.5 14.4 15.1 15 14.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-poppins font-normal text-sm md:text-base text-gray m-0">2025 Skillswap. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
