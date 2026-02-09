import React from 'react';

const ProfileTips: React.FC = () => {
    return (
        <div className="w-[544px] h-[245.5px] bg-white border border-[#E5E7EB] shadow-[0px_4px_4px_rgba(0,0,0,0.2)] rounded-[16px] p-[24px_16px] flex flex-col gap-[16px] font-inter">
            <div className="flex items-center gap-[18px] w-full">
                <div className="w-[68.12px] h-[67.5px] rounded-[50px] bg-[#3E8FCC] flex items-center justify-center shadow-[inset_0_0_0_1000px_rgba(0,0,0,0.2)]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18H15M10.2 21H13.8M12 3C7.58172 3 4 6.58172 4 11C4 13.4355 5.0883 15.6173 6.81226 17.0941C7.20059 17.426 7.4221 17.9158 7.41432 18.4237L7.38462 20.3538C7.37563 20.9388 7.84852 21.414 8.43362 21.414H15.5664C16.1515 21.414 16.6244 20.9388 16.6154 20.3538L16.5857 18.4237C16.5779 17.9158 16.7994 17.426 17.1877 17.0941C18.9117 15.6173 20 13.4355 20 11C20 6.58172 16.4183 3 12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="font-semibold text-[20px] leading-[24px] color-black">Tips for a great profile</h3>
            </div>

            <ul className="flex flex-col gap-[24px] w-full">
                <li className="flex items-center gap-[11px]">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#666666] shrink-0" />
                    <p className="text-[18px] leading-[22px] font-semibold text-[#666666]">
                        Use a clear, friendly profile photo to build trust.
                    </p>
                </li>
                <li className="flex items-center gap-[11px]">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#666666] shrink-0" />
                    <p className="text-[18px] leading-[22px] font-semibold text-[#666666]">
                        Describe your skills and what you'd like to learn.
                    </p>
                </li>
                <li className="flex items-center gap-[11px]">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#666666] shrink-0" />
                    <p className="text-[18px] leading-[22px] font-semibold text-[#666666]">
                        Be specific about your availability for better matches.
                    </p>
                </li>
            </ul>
        </div>
    );
};

export default ProfileTips;
