const ProviderCard = () => {
  return (
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
  );
};
export default ProviderCard;
