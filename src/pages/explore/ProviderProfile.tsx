import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, Header } from "@/components";
import Reviews from "@/components/explore/Reviews";
import {
  getReviews,
  getSkillDetails,
  type ReviewsData,
  type SkillDetailsResponse,
} from "@/services";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { userId = "", skillId = "" } = useParams<{ userId: string; skillId: string }>();

  const [details, setDetails] = useState<SkillDetailsResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  const hasParams = Boolean(userId && skillId);

  useEffect(() => {
    const loadDetails = async () => {
      if (!hasParams) {
        setDetails(null);
        setError("Missing provider context");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSkillDetails(skillId, userId);
        setDetails(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    };

    void loadDetails();
  }, [hasParams, skillId, userId]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!hasParams) {
        setReviews(null);
        return;
      }

      try {
        setLoadingReviews(true);
        setErrorReviews(null);
        const data = await getReviews(userId, skillId, 1, 10);
        setReviews(data);
      } catch (err: any) {
        setErrorReviews(err?.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    void loadReviews();
  }, [hasParams, skillId, userId]);

  const provider = details?.provider;
  const skill = details?.skill;
  const profileRating = useMemo(() => {
    if (!provider) return 0;
    return provider.rating || provider.avgRate || provider.avarage || 0;
  }, [provider]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header activeTab="Explore" />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 flex-grow space-y-8">
        <section className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[12px] p-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : error ? (
            <div>
              <p className="text-red-600 font-semibold">Failed to load provider</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={provider?.image || "https://via.placeholder.com/64"}
                    alt={provider?.userName || "Provider"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[#0c0d0f]">
                    {provider?.userName || "Provider"}
                  </h1>
                  <p className="text-[#666] text-sm">
                    {provider?.bio || "No provider bio available."}
                  </p>
                </div>
              </div>

              {details?.skillDescription ? (
                <div className="border-l-2 border-primary pl-3 text-[#0c0d0f]">
                  {details.skillDescription}
                </div>
              ) : null}

              <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-between gap-2 flex-wrap">
                <div className="text-sm text-[#666]">
                  ★ {Number(profileRating).toFixed(1)} ({provider?.totalFeedbacks || 0} reviews)
                </div>
                <span className="bg-[rgba(62,143,204,0.2)] text-primary text-xs rounded-full px-2 py-1">
                  {details?.countSessions || 0} Total Sessions
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-bold text-[#0c0d0f]">Offered Skills</h2>
          <button
            type="button"
            onClick={() => {
              if (!skillId || !userId) return;
              navigate(`/explore/${skillId}/${userId}`);
            }}
            className="w-full bg-white border border-[#e5e7eb] rounded-[10px] p-3 flex items-center justify-between text-left hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[10px] bg-[rgba(62,143,204,0.2)] text-primary flex items-center justify-center font-semibold text-xl">
                {(skill?.name || "S").charAt(0)}
              </div>
              <div>
                <p className="text-[#0c0d0f] text-lg">{skill?.name || "Skill"}</p>
                <p className="text-[#666] text-sm">★ {Number(profileRating).toFixed(1)}</p>
              </div>
            </div>
            <span className="text-[#666] text-xl">{">"}</span>
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="text-3xl font-bold text-[#0c0d0f]">Recognition Badges</h2>
          <div className="flex gap-3">
            <div className="bg-[rgba(62,143,204,0.1)] rounded-full px-4 py-2 text-sm text-[#0c0d0f]">
              First Exchange
            </div>
            <div className="bg-[rgba(52,199,89,0.1)] rounded-full px-4 py-2 text-sm text-[#0c0d0f]">
              Active Member
            </div>
          </div>
        </section>

        <Reviews
          data={reviews}
          loading={loadingReviews}
          error={errorReviews}
          userId={userId}
          skillId={skillId}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
