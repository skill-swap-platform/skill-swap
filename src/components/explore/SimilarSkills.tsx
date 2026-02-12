const SimilarSkills = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-text-primary text-4xl font-bold">Similar Skills</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Recommendation Card 1 */}
        <div className="bg-white rounded-[16px] shadow-lg p-6 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-20 h-22 rounded-[16px] bg-gray-300 flex-shrink-0 overflow-hidden">
                <img
                  src="https://via.placeholder.com/83x88"
                  alt="Skill"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <p className="text-text-primary text-2xl font-semibold">
                    Sarah Johnson
                  </p>
                  <p className="text-[#666] text-lg">Marketing Strategist</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <p className="text-text-primary text-sm font-semibold">
                      4.8
                    </p>
                  </div>
                  <div className="w-1 h-1 bg-[#666] rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <p className="text-text-primary text-sm">12 swaps</p>
                  </div>
                </div>
              </div>

              {/* Bookmark */}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <p className="text-text-primary text-xl font-semibold">
                Mastering Data Visualization
              </p>
              <p className="text-[#666] text-lg">
                Seeking a mentor to guide me through the intricacies of data
                visualization techniques.
              </p>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="flex gap-2">
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">React.js</p>
            </div>
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">Node.js</p>
            </div>
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">SQL</p>
            </div>
          </div>

          {/* View Details Button */}
          <button className="bg-primary text-white rounded-[10px] py-1.5 font-normal text-xs hover:opacity-90 transition w-full">
            View Details
          </button>
        </div>

        {/* Recommendation Card 2 */}
        <div className="bg-white rounded-[16px] shadow-lg p-6 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Image */}
              <div className="w-20 h-22 rounded-[16px] bg-gray-300 flex-shrink-0 overflow-hidden">
                <img
                  src="https://via.placeholder.com/83x88"
                  alt="Skill"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <p className="text-text-primary text-2xl font-semibold">
                    Sarah Johnson
                  </p>
                  <p className="text-[#666] text-lg">Marketing Strategist</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <p className="text-text-primary text-sm font-semibold">
                      4.8
                    </p>
                  </div>
                  <div className="w-1 h-1 bg-[#666] rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <p className="text-text-primary text-sm">12 swaps</p>
                  </div>
                </div>
              </div>

              {/* Bookmark */}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <p className="text-text-primary text-xl font-semibold">
                Mastering Data Visualization
              </p>
              <p className="text-[#666] text-lg">
                Seeking a mentor to guide me through the intricacies of data
                visualization techniques.
              </p>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="flex gap-2">
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">React.js</p>
            </div>
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">Node.js</p>
            </div>
            <div className="bg-[#e6e6e6] rounded-[8px] px-2.5 py-1.5">
              <p className="text-[#666] text-lg text-center">SQL</p>
            </div>
          </div>

          {/* View Details Button */}
          <button className="bg-primary text-white rounded-[10px] py-1.5 font-normal text-xs hover:opacity-90 transition w-full">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarSkills;
