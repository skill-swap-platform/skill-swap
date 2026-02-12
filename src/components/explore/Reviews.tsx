import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-text-primary text-4xl font-bold">Reviews</h2>
        <button
          onClick={() => navigate("/all-reviews")}
          className="text-[#666] text-sm hover:opacity-70 transition"
        >
          See All
        </button>
      </div>

      {/* Review Card */}
      <div className="bg-white rounded-[10px] shadow-lg p-4">
        <div className="flex gap-2 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src="" alt="Reviewer" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-text-primary font-semibold">Emma Rodriguez</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
              </svg>
              <p className="text-text-primary text-sm">4.8</p>
            </div>
          </div>
        </div>
        <p className="text-[#666] text-lg mb-2">
          " Emma was incredibly patient and clear, Highly recommended for React
          skills"
        </p>
        <p className="text-chip_text text-sm">1.5K see this comment helpful</p>
      </div>
    </div>
  );
};
export default Reviews;
