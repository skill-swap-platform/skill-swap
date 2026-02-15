import { Footer, Header } from "@/components";
import ProviderCard from "@/components/explore/ProviderCard";
import Reviews from "@/components/explore/Reviews";
import SessionDetails from "@/components/explore/SessionDetails";
import SimilarSkills from "@/components/explore/SimilarSkills";
import SkillInformationCard from "@/components/explore/SkillInformationCard";
import { useNavigate } from "react-router";

const Explore = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col items-center">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="w-full max-w-6xl px-20 py-8 flex flex-col gap-8">
        {/* Skill Information Card */}
        <SkillInformationCard />

        {/* Session Details */}
        <SessionDetails />

        {/* Provider Card */}
        <ProviderCard />

        {/* Reviews Section */}
        <Reviews />

        {/* Request Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/request-skill")}
            className="bg-primary text-white rounded-[10px] px-8 py-3 font-medium hover:opacity-90 transition"
          >
            Request Skill Swap
          </button>
        </div>

        {/* Similar Skills Section */}
        <SimilarSkills />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
