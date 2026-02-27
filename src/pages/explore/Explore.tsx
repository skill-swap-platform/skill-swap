import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Footer, Header } from "@/components";
import ProviderCard from "@/components/explore/ProviderCard";
import Reviews from "@/components/explore/Reviews";
import SessionDetails from "@/components/explore/SessionDetails";
import SimilarSkills from "@/components/explore/SimilarSkills";
import SkillInformationCard from "@/components/explore/SkillInformationCard";
import {
  getRecommendedUserSkill,
  getReviews,
  getSimilarSkillUsers,
  getSkillDetails,
  getSkillIdentifier,
  getUserIdentifier,
  type ExploreResultItem,
  type RecommendedUserSkill,
  type ReviewsData,
  type SkillDetailsResponse,
} from "@/services";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const candidate = error as { response?: { data?: { message?: unknown } } };
    if (typeof candidate.response?.data?.message === "string") {
      return candidate.response.data.message;
    }
  }

  return fallback;
};

const Explore = () => {
  const navigate = useNavigate();
  const { skillId: paramSkillId, userId: paramUserId } = useParams<{
    skillId: string;
    userId: string;
  }>();

  const [skillData, setSkillData] = useState<SkillDetailsResponse | null>(null);
  const [similarUsers, setSimilarUsers] = useState<ExploreResultItem[]>([]);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [recommendedSkill, setRecommendedSkill] =
    useState<RecommendedUserSkill | null>(null);

  const [loadingSkill, setLoadingSkill] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  const [errorSkill, setErrorSkill] = useState<string | null>(null);
  const [errorSimilar, setErrorSimilar] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  const fallbackSkillId = getSkillIdentifier(recommendedSkill?.skill);
  const fallbackUserId = getUserIdentifier(recommendedSkill?.user);
  const finalSkillId = paramSkillId || fallbackSkillId;
  const finalUserId = paramUserId || fallbackUserId;
  const canLoadDetails = Boolean(finalSkillId && finalUserId);
  const shouldRedirectToSearch =
    !canLoadDetails && !loadingRecommended && !recommendedSkill;

  const displaySkillData = useMemo<SkillDetailsResponse | null>(() => {
    if (skillData) {
      return skillData;
    }

    if (!recommendedSkill) {
      return null;
    }

    return {
      provider: recommendedSkill.user,
      skill: recommendedSkill.skill,
      level: recommendedSkill.user.level || "Not specified",
      sessionLanguage: recommendedSkill.skill.language || "Not specified",
      skillDescription: recommendedSkill.skill.description || "",
      reviews: {
        count:
          recommendedSkill.user.totalFeedbacks ??
          recommendedSkill.user.totalFeedback ??
          0,
        LatestReviewDto: {
          rating:
            recommendedSkill.user.rating ??
            recommendedSkill.user.avgRate ??
            recommendedSkill.user.avarage ??
            0,
        },
      },
      sessions: [],
      countSessions: 0,
    };
  }, [recommendedSkill, skillData]);

  useEffect(() => {
    const fetchRecommendedSkill = async () => {
      try {
        setLoadingRecommended(true);
        setErrorRecommended(null);
        const data = await getRecommendedUserSkill();
        setRecommendedSkill(data);
      } catch (error: unknown) {
        console.warn("Could not load recommended skill:", error);
        setErrorRecommended(getErrorMessage(error, "Could not load recommended users"));
      } finally {
        setLoadingRecommended(false);
      }
    };

    void fetchRecommendedSkill();
  }, []);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      if (!canLoadDetails || !finalSkillId || !finalUserId) {
        setSkillData(null);
        return;
      }

      try {
        setLoadingSkill(true);
        setErrorSkill(null);
        const data = await getSkillDetails(finalSkillId, finalUserId);
        setSkillData(data);
      } catch (error: unknown) {
        setErrorSkill(getErrorMessage(error, "Failed to load skill details"));
        console.error("Error loading skill details:", error);
      } finally {
        setLoadingSkill(false);
      }
    };

    void fetchSkillDetails();
  }, [canLoadDetails, finalSkillId, finalUserId]);

  useEffect(() => {
    const fetchSimilarUsers = async () => {
      if (!finalSkillId) {
        setSimilarUsers([]);
        return;
      }

      try {
        setLoadingSimilar(true);
        setErrorSimilar(null);
        const data = await getSimilarSkillUsers(finalSkillId);
        setSimilarUsers(data);
      } catch (error: unknown) {
        setErrorSimilar(getErrorMessage(error, "Failed to load similar users"));
        console.error("Error loading similar users:", error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    void fetchSimilarUsers();
  }, [finalSkillId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!finalUserId || !finalSkillId) {
        setReviews(null);
        return;
      }

      try {
        setLoadingReviews(true);
        setErrorReviews(null);
        const data = await getReviews(finalUserId, finalSkillId, 1, 10);
        setReviews(data);
      } catch (error: unknown) {
        setErrorReviews(getErrorMessage(error, "Failed to load reviews"));
        console.error("Error loading reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    void fetchReviews();
  }, [finalUserId, finalSkillId]);

  const requestSkillId = finalSkillId;
  const requestUserSkillId = skillData?.userSkillId?.trim() || "";
  const requestReceiverId = finalUserId;
  const requestSkillName = displaySkillData?.skill?.name || "";
  const canRequestSwap = Boolean(requestSkillId && requestReceiverId);

  const handleRequestSwap = () => {
    if (!canRequestSwap) {
      return;
    }

    const query = new URLSearchParams({
      receiverId: requestReceiverId,
      requestedSkillId: requestSkillId,
      requestedSkillName: requestSkillName,
    });
    if (requestUserSkillId) {
      query.set("requestedUserSkillId", requestUserSkillId);
    }

    navigate(`/request-skill?${query.toString()}`);
  };

  useEffect(() => {
    if (shouldRedirectToSearch) {
      navigate("/search", { replace: true });
    }
  }, [navigate, shouldRedirectToSearch]);

  return (
    <div className="bg-[#f9fafb] flex min-h-screen flex-col items-center">
      <Header activeTab="Explore" />

      <main className="w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-20">
        <div className="mx-auto w-full max-w-[1280px] flex flex-col gap-8">
          <SkillInformationCard
            data={displaySkillData}
            loading={loadingSkill || loadingRecommended}
            error={errorSkill}
          />

          <SessionDetails
            data={displaySkillData}
            loading={loadingSkill || loadingRecommended}
            error={errorSkill}
          />

          <ProviderCard
            data={displaySkillData?.provider}
            loading={loadingSkill || loadingRecommended}
            error={errorSkill}
            skillId={finalSkillId}
          />

          <Reviews
            data={reviews}
            loading={loadingReviews}
            error={errorReviews}
            userId={finalUserId}
            skillId={finalSkillId}
          />

          <div className="flex justify-stretch sm:justify-end">
            <button
              onClick={handleRequestSwap}
              className="h-12 w-full rounded-[10px] bg-[#3e8fcc] px-6 text-base font-medium text-white transition hover:opacity-90 sm:w-[345px]"
              disabled={loadingSkill || !canRequestSwap}
            >
              {canRequestSwap ? "Request Skill Swap" : "Provider data unavailable"}
            </button>
          </div>

          <SimilarSkills
            data={similarUsers}
            loading={loadingSimilar}
            error={errorSimilar}
            recommendedData={recommendedSkill}
            recommendedLoading={loadingRecommended}
            recommendedError={errorRecommended}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
