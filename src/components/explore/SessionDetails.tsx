const SessionDetails = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-text-primary text-4xl font-bold">Session Details</h2>

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
                <p className="text-[#666] text-lg font-medium">Intermediate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
