interface SessionDetailsProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
}

const SessionDetails = ({ data, loading = false, error = null }: SessionDetailsProps) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Session Details</h2>
        <div className="bg-neutral-background2 rounded-[12px] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 bg-white rounded-[10px] p-3 sm:p-4">
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Session Details</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6">
          <p className="text-red-600 font-semibold">Error loading session details</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const sessionLanguage = data?.sessionLanguage || 'Not specified';
  const level = data?.level || 'Not specified';
  const sessionCount = data?.countSessions || 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Session Details</h2>

      <div className="bg-neutral-background2 rounded-[12px] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Skill Language */}
          <div className="flex-1 bg-white rounded-[10px] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="bg-tint-fill rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                <p className="text-text-primary text-sm sm:text-lg lg:text-lg font-semibold">
                  Skill Language
                </p>
              </div>
              <div className="bg-neutral-divider rounded-[20px] px-3 py-1 sm:px-4 sm:py-2 whitespace-nowrap">
                <p className="text-[#666] text-xs sm:text-base lg:text-base font-medium">{sessionLanguage}</p>
              </div>
            </div>
          </div>

          {/* Session Duration */}
          <div className="flex-1 bg-white rounded-[10px] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="bg-tint-fill rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                <p className="text-text-primary text-sm sm:text-lg lg:text-lg font-semibold">
                  Sessions Available
                </p>
              </div>
              <div className="bg-neutral-divider rounded-[20px] px-3 py-1 sm:px-4 sm:py-2 whitespace-nowrap\">
                <p className="text-[#666] text-xs sm:text-base lg:text-base font-medium\">{sessionCount}</p>
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="flex-1 bg-white rounded-[10px] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0\">
                <div className="bg-tint-fill rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0\">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm sm:text-lg lg:text-lg font-semibold">
                    Skill Level
                  </p>
                </div>
              </div>
              <div className="bg-neutral-divider rounded-[20px] px-3 py-1 sm:px-4 sm:py-2 whitespace-nowrap">
                <p className="text-[#666] text-xs sm:text-base lg:text-base font-medium">{level}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
