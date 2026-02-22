import { useNavigate } from "react-router-dom";

interface ProviderCardProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
}

const ProviderCard = ({ data, loading = false, error = null }: ProviderCardProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Provider</h2>
        <div className="bg-white rounded-[5px] shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gray-200 flex-shrink-0 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Provider</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6">
          <p className="text-red-600 font-semibold">Error loading provider information</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Provider</h2>
        <div className="bg-white rounded-[5px] shadow-lg p-4 sm:p-6">
          <p className="text-gray-500">No provider information available</p>
        </div>
      </div>
    );
  }

  const provider = data;
  const userName = provider?.userName || 'Unknown Provider';
  const image = provider?.image || 'https://via.placeholder.com/60';
  const bio = provider?.bio || '';
  const rating = provider?.rating || 0;
  const totalFeedbacks = provider?.totalFeedbacks || 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Provider</h2>

      <div className="bg-white rounded-[5px] shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Provider Avatar */}
          <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Provider Info */}
          <div className="flex-1">
            <p className="text-text-primary text-lg sm:text-xl font-semibold">
              {userName}
            </p>
            {bio && <p className="text-[#666] text-xs sm:text-sm line-clamp-2">{bio}</p>}
            <div className="flex items-center gap-1 mt-1 sm:mt-2 text-xs sm:text-sm">
              {rating > 0 && (
                <>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                  </svg>
                  <p className="text-text-primary text-sm font-semibold">
                    {rating.toFixed(1)}
                  </p>
                </>
              )}
              <p className="text-text-primary text-sm">
                ({totalFeedbacks}+ {totalFeedbacks === 1 ? 'session' : 'sessions'})
              </p>
            </div>
          </div>

          {/* View Profile Button */}
          <button 
            onClick={() => navigate(`/profiles/${provider?.id}`)}
            className="border border-chip_text text-chip_text rounded-[10px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-chip-background transition whitespace-nowrap flex-shrink-0"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
