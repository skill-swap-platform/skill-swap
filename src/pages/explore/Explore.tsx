import { useState, useEffect } from "react";
import { Footer, Header } from "@/components";
import ProviderCard from "@/components/explore/ProviderCard";
import Reviews from "@/components/explore/Reviews";
import SessionDetails from "@/components/explore/SessionDetails";
import SimilarSkills from "@/components/explore/SimilarSkills";
import SkillInformationCard from "@/components/explore/SkillInformationCard";
import { useNavigate, useParams } from "react-router";
import { getSkillDetails, getSimilarSkillUsers, getReviews, getRecommendedUserSkill } from "@/services";

const Explore = () => {
  const navigate = useNavigate();
  const { skillId, userId } = useParams<{ skillId: string; userId: string }>();
  
  // Use mock IDs if not provided (for development)
  const finalSkillId = skillId || 'mock-skill-1';
  const finalUserId = userId || 'mock-user-1';
  
  const [skillData, setSkillData] = useState<any>(null);
  const [similarUsers, setSimilarUsers] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [recommendedSkill, setRecommendedSkill] = useState<any>(null);
  
  const [loadingSkill, setLoadingSkill] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  
  const [errorSkill, setErrorSkill] = useState<string | null>(null);
  const [errorSimilar, setErrorSimilar] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  // Fetch skill details
  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        setLoadingSkill(true);
        setErrorSkill(null);
        const data = await getSkillDetails(finalSkillId, finalUserId);
        setSkillData(data);
      } catch (error: any) {
        setErrorSkill(error?.response?.data?.message || 'Failed to load skill details');
        console.error('Error loading skill details:', error);
      } finally {
        setLoadingSkill(false);
      }
    };

    fetchSkillDetails();
  }, [finalSkillId, finalUserId]);

  // Fetch similar users
  useEffect(() => {
    const fetchSimilarUsers = async () => {
      try {
        setLoadingSimilar(true);
        setErrorSimilar(null);
        const data = await getSimilarSkillUsers(finalSkillId);
        setSimilarUsers(data);
      } catch (error: any) {
        setErrorSimilar(error?.response?.data?.message || 'Failed to load similar users');
        console.error('Error loading similar users:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarUsers();
  }, [finalSkillId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        setErrorReviews(null);
        const data = await getReviews(finalUserId, finalSkillId, 1, 10);
        setReviews(data);
      } catch (error: any) {
        setErrorReviews(error?.response?.data?.message || 'Failed to load reviews');
        console.error('Error loading reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [finalUserId, finalSkillId]);

  // Fetch recommended skill
  useEffect(() => {
    const fetchRecommendedSkill = async () => {
      try {
        setLoadingRecommended(true);
        setErrorRecommended(null);
        const data = await getRecommendedUserSkill();
        setRecommendedSkill(data);
      } catch (error: any) {
        // Recommended skill is optional, so don't show critical error
        console.warn('Could not load recommended skill:', error);
        setErrorRecommended(null);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedSkill();
  }, []);

  return (
    <div className="bg-white flex flex-col items-center">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Skill Information Card */}
        <SkillInformationCard 
          data={skillData} 
          loading={loadingSkill} 
          error={errorSkill} 
        />

        {/* Session Details */}
        <SessionDetails 
          data={skillData} 
          loading={loadingSkill} 
          error={errorSkill} 
        />

        {/* Provider Card */}
        <ProviderCard 
          data={skillData?.provider} 
          loading={loadingSkill} 
          error={errorSkill} 
        />

        {/* Reviews Section */}
        <Reviews 
          data={reviews} 
          loading={loadingReviews} 
          error={errorReviews}
          userId={finalUserId}
          skillId={finalSkillId}
        />

        {/* Request Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate(`/request-skill?skillId=${skillId}&userId=${userId}`)}
            className="bg-primary text-white rounded-[10px] px-6 sm:px-8 py-2 sm:py-3 font-medium hover:opacity-90 transition w-full sm:w-auto"
            disabled={loadingSkill}
          >
            {loadingSkill ? 'Loading...' : 'Request Skill Swap'}
          </button>
        </div>

        {/* Similar Skills Section */}
        <SimilarSkills 
          data={similarUsers} 
          loading={loadingSimilar} 
          error={errorSimilar}
          recommendedData={recommendedSkill}
          recommendedLoading={loadingRecommended}
          recommendedError={errorRecommended}
        />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
