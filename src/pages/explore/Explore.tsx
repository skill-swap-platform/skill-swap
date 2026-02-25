import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "@/components";
import ProviderCard from "@/components/explore/ProviderCard";
import Reviews from "@/components/explore/Reviews";
import SessionDetails from "@/components/explore/SessionDetails";
import SimilarSkills from "@/components/explore/SimilarSkills";
import SkillInformationCard from "@/components/explore/SkillInformationCard";
import { useNavigate, useParams } from "react-router";
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

const Explore = () => {
  const navigate = useNavigate();
  const { skillId: paramSkillId, userId: paramUserId } = useParams<{
    skillId: string;
    userId: string;
  }>();

  const [skillData, setSkillData] = useState<SkillDetailsResponse | null>(null);
  const [similarUser, setSimilarUser] = useState<ExploreResultItem | null>(null);
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
      level: recommendedSkill.user.level,
      sessionLanguage: recommendedSkill.skill.language,
      skillDescription: recommendedSkill.skill.description,
      reviews: {
        count:
          recommendedSkill.user.totalFeedbacks ??
          recommendedSkill.user.totalFeedback ??
          0,
        LatestReviewDto: {
          rating:
            recommendedSkill.user.rating ??
            recommendedSkill.user.avgRate ??
            recommendedSkill.user.avarage,
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
      } catch (error: any) {
        console.warn("Could not load recommended skill:", error);
        setErrorRecommended(
          error?.response?.data?.message || "Could not load recommended users",
        );
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedSkill();
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
      } catch (error: any) {
        setErrorSkill(
          error?.response?.data?.message || "Failed to load skill details",
        );
        console.error("Error loading skill details:", error);
      } finally {
        setLoadingSkill(false);
      }
    };

    fetchSkillDetails();
  }, [canLoadDetails, finalSkillId, finalUserId]);

  useEffect(() => {
    const fetchSimilarUsers = async () => {
      if (!finalSkillId) {
        setSimilarUser(null);
        return;
      }

      try {
        setLoadingSimilar(true);
        setErrorSimilar(null);
        const data = await getSimilarSkillUsers(finalSkillId);
        setSimilarUser(data);
      } catch (error: any) {
        setErrorSimilar(
          error?.response?.data?.message || "Failed to load similar users",
        );
        console.error("Error loading similar users:", error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarUsers();
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
      } catch (error: any) {
        setErrorReviews(error?.response?.data?.message || "Failed to load reviews");
        console.error("Error loading reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [finalUserId, finalSkillId]);

  const requestSkillId = finalSkillId;
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

    navigate(`/request-skill?${query.toString()}`);
  };

  useEffect(() => {
    if (shouldRedirectToSearch) {
      navigate("/search", { replace: true });
    }
  }, [navigate, shouldRedirectToSearch]);

  return (
    <div className="bg-white flex flex-col items-center">
      <Header activeTab="Explore" />

      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleRequestSwap}
            className="bg-primary text-white rounded-[10px] px-6 sm:px-8 py-2 sm:py-3 font-medium hover:opacity-90 transition w-full sm:w-auto"
            disabled={loadingSkill || !canRequestSwap}
          >
            {canRequestSwap ? "Request Skill Swap" : "Provider data unavailable"}
          </button>
        </div>

        <SimilarSkills
          data={similarUser}
          loading={loadingSimilar}
          error={errorSimilar}
          recommendedData={recommendedSkill}
          recommendedLoading={loadingRecommended}
          recommendedError={errorRecommended}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Explore;
