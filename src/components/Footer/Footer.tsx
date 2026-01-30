import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101828] px-20 py-12 w-full mt-auto">
      <div className="flex gap-25 max-w-[1440px] mx-auto mb-10">
        <div className="flex flex-col gap-4 w-[341px] flex-shrink-0">
          <div className="text-2xl text-center w-[304px] flex-shrink-0">
            <span className="font-poppins font-normal text-warning">Skill</span>
            <span className="font-poppins font-bold text-primary">Swap</span>
            <span className="font-poppins font-bold text-warning">.</span>
          </div>
          <div className="font-semibold text-lg text-gray w-full flex-shrink-0">
            <p>Exchange skills, build connections, and</p>
            <p>grow together</p>
          </div>
        </div>
        
        <div className="flex font-semibold gap-35 items-center text-lg flex-shrink-0">
          <div className="flex flex-col gap-[30px] items-start flex-shrink-0">
            <h3 className="text-white m-0 text-lg font-semibold">Product</h3>
            <div className="flex flex-col gap-3 items-start w-full flex-shrink-0">
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Features</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">How it works</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Pricing</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Success Stories</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-[30px] items-start flex-shrink-0">
            <h3 className="text-white m-0 text-lg font-semibold">Company</h3>
            <div className="flex flex-col gap-3 items-start w-full flex-shrink-0">
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">About Us</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Careers</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Blog</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Contact</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-[30px] items-start flex-shrink-0">
            <h3 className="text-white m-0 text-lg font-semibold">Legal</h3>
            <div className="flex flex-col gap-3 items-start w-full flex-shrink-0">
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Privacy Policy</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Terms of Service</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Cookie Policy</a>
              <a href="#" className="text-gray no-underline text-lg font-semibold flex-shrink-0 hover:text-[#ccc]">Guidelines</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 items-center py-4 w-full flex-shrink-0">
        <hr className="w-full max-w-[1440px] border-none border-t border-[#333] m-0" />
        <div className="flex gap-2.5 items-center flex-shrink-0">
          <svg className="w-6 h-6 flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#999999" strokeWidth="1.5" strokeMiterlimit="10"/>
            <path d="M15 9.5C14.4 8.9 13.5 8.5 12.5 8.5C10.6 8.5 9 10.1 9 12C9 13.9 10.6 15.5 12.5 15.5C13.5 15.5 14.4 15.1 15 14.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-poppins font-normal text-base text-gray m-0 flex-shrink-0">2025 Skillswap. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
