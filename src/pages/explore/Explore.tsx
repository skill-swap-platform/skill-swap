import { Footer, Header } from "@/components";

const Explore = () => {
  return (
    <div className="bg-white flex flex-col items-center">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="w-full max-w-6xl px-20 py-8 flex flex-col gap-8">
        {/* Skill Information Card */}
        <div className="bg-white border border-neutral-border rounded-[10px] p-6 flex flex-col gap-4">
          <h1 className="text-text-primary text-4xl font-bold">
            Photography Basics
          </h1>

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
              <p className="text-chip_text text-sm font-inter">Intermediate</p>
            </div>
            <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
              <p className="text-chip_text text-sm font-inter">60 min</p>
            </div>
            <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
              <p className="text-chip_text text-sm font-inter">English</p>
            </div>
          </div>

          {/* Description with border */}
          <div className="border-l-[1.5px] border-chip_text px-2 py-2">
            <p className="text-text-primary text-lg">
              Learn the core concepts of aperture, shutter speed, and ISO. By
              the end of this session, you will be able to shoot in manual mode
              and understand composition rules. This is a foundational session
              perfect for new camera owners.
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 py-2 px-1">
            <svg
              className="w-3.5 h-3.5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
            </svg>
            <p className="text-text-primary text-sm">4.9</p>
            <p className="text-[#666] text-sm">(50 reviews)</p>
          </div>
        </div>

        {/* Session Details */}
        <div className="flex flex-col gap-6">
          <h2 className="text-text-primary text-4xl font-bold">
            Session Details
          </h2>

          <div className="bg-neutral-background2 rounded-[12px] p-6">
            <div className="flex gap-2">
              {/* Skill Language */}
              <div className="flex-1 bg-white rounded-[10px] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-tint-fill rounded-full w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m0 0H4M15.25 5H21"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary text-xl font-semibold">
                      Skill Language
                    </p>
                  </div>
                  <div className="bg-neutral-divider rounded-[20px] px-4 py-2">
                    <p className="text-[#666] text-lg font-medium">English</p>
                  </div>
                </div>
              </div>

              {/* Session Duration */}
              <div className="flex-1 bg-white rounded-[10px] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-tint-fill rounded-full w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary text-xl font-semibold">
                      Session Duration
                    </p>
                  </div>
                  <div className="bg-neutral-divider rounded-[20px] px-4 py-2">
                    <p className="text-[#666] text-lg font-medium">60 min</p>
                  </div>
                </div>
              </div>

              {/* Skill Level */}
              <div className="flex-1 bg-white rounded-[10px] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-tint-fill rounded-full w-12 h-12 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary text-xl font-semibold">
                        Skill Level
                      </p>
                    </div>
                  </div>
                  <div className="bg-neutral-divider rounded-[20px] px-4 py-2">
                    <p className="text-[#666] text-lg font-medium">
                      Intermediate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Card */}
        <div className="flex flex-col gap-4">
          <h2 className="text-text-primary text-4xl font-bold">Provider</h2>

          <div className="bg-white rounded-[5px] shadow-lg p-6">
            <div className="flex items-center gap-3">
              {/* Provider Avatar */}
              <div className="w-15 h-15 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="https://via.placeholder.com/60"
                  alt="Provider"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Provider Info */}
              <div className="flex-1">
                <p className="text-text-primary text-xl font-semibold">
                  Hya Al Rubi
                </p>
                <p className="text-[#666] text-sm">Photographer & Filmmaker</p>
                <div className="flex items-center gap-1 mt-2">
                  <p className="text-text-primary text-sm font-semibold">4.8</p>
                  <p className="text-text-primary text-sm">(10+ sessions)</p>
                </div>
              </div>

              {/* View Profile Button */}
              <button className="border border-chip_text text-chip_text rounded-[10px] px-3 py-1 text-xs hover:bg-chip-background transition">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-text-primary text-4xl font-bold">Reviews</h2>
            <button
              onClick={() => console.log("Navigate to reviews")}
              className="text-[#666] text-sm hover:opacity-70 transition"
            >
              See All
            </button>
          </div>

          {/* Review Card */}
          <div className="bg-white rounded-[10px] shadow-lg p-4">
            <div className="flex gap-2 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="https://via.placeholder.com/48"
                  alt="Reviewer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-text-primary font-semibold">
                  Emma Rodriguez
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-text-primary text-sm">4.8</p>
                </div>
              </div>
            </div>
            <p className="text-[#666] text-lg mb-2">
              " Emma was incredibly patient and clear, Highly recommended for
              React skills"
            </p>
            <p className="text-chip_text text-sm">
              1.5K see this comment helpful
            </p>
          </div>
        </div>

        {/* Request Button */}
        <div className="flex justify-end mb-4">
          <button className="bg-primary text-white rounded-[10px] px-8 py-3 font-medium hover:opacity-90 transition">
            Request Skill Swap
          </button>
        </div>

        {/* Similar Skills Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-text-primary text-4xl font-bold">
            Similar Skills
          </h2>

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
                      <p className="text-[#666] text-lg">
                        Marketing Strategist
                      </p>
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
                      <p className="text-[#666] text-lg">
                        Marketing Strategist
                      </p>
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
