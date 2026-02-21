import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "@/components";
import ProviderCard from "@/components/explore/ProviderCard";
import Reviews from "@/components/explore/Reviews";
import SessionDetails from "@/components/explore/SessionDetails";
import SimilarSkills from "@/components/explore/SimilarSkills";
import SkillInformationCard from "@/components/explore/SkillInformationCard";
import axiosInstance from "@/api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

interface RequestSkillContext {
  receiverId: string;
  requestedSkillId: string;
  requestedSkillName?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getRecord = (obj: Record<string, unknown>, key: string): Record<string, unknown> | null => {
  const value = obj[key];
  return isRecord(value) ? value : null;
};

const getString = (obj: Record<string, unknown> | null, key: string): string => {
  if (!obj) return "";
  const value = obj[key];
  if (typeof value !== "string") return "";
  return value.trim();
};

const extractCandidateFromItem = (item: unknown): RequestSkillContext | null => {
  if (!isRecord(item)) return null;

  const user = getRecord(item, "user")
    || getRecord(item, "provider")
    || getRecord(item, "owner");
  const userSkill = getRecord(item, "userSkill")
    || getRecord(item, "requestedUserSkill")
    || getRecord(item, "requestedSkill");
  const nestedSkill = getRecord(userSkill ?? {}, "skill")
    || getRecord(item, "skill");

  const receiverId = getString(item, "receiverId")
    || getString(item, "providerId")
    || getString(item, "userId")
    || getString(user, "id");

  let requestedSkillId = getString(item, "requestedSkillId")
    || getString(item, "userSkillId")
    || getString(userSkill, "id");

  if (!requestedSkillId) {
    const directId = getString(item, "id");
    const hasSkillSignals = Boolean(
      nestedSkill
      || getString(item, "level")
      || getString(item, "sessionLanguage")
    );
    if (directId && hasSkillSignals && receiverId) {
      requestedSkillId = directId;
    }
  }

  const requestedSkillName = getString(item, "requestedSkillName")
    || getString(item, "skillName")
    || getString(userSkill, "name")
    || getString(nestedSkill, "name");

  if (!receiverId || !requestedSkillId) return null;

  return {
    receiverId,
    requestedSkillId,
    requestedSkillName: requestedSkillName || undefined,
  };
};

const extractCandidates = (payload: unknown): RequestSkillContext[] => {
  const queue: unknown[] = [payload];
  const candidates: RequestSkillContext[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (Array.isArray(current)) {
      for (const item of current) {
        const candidate = extractCandidateFromItem(item);
        if (candidate) {
          candidates.push(candidate);
        }
        if (isRecord(item) || Array.isArray(item)) {
          queue.push(item);
        }
      }
      continue;
    }

    if (!isRecord(current)) continue;
    for (const value of Object.values(current)) {
      if (Array.isArray(value) || isRecord(value)) {
        queue.push(value);
      }
    }
  }

  const unique = new Map<string, RequestSkillContext>();
  for (const candidate of candidates) {
    unique.set(`${candidate.receiverId}:${candidate.requestedSkillId}`, candidate);
  }

  return [...unique.values()];
};

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryContext = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const receiverId = params.get("receiverId")?.trim() || "";
    const requestedSkillId = params.get("requestedSkillId")?.trim() || "";
    const requestedSkillName = params.get("requestedSkillName")?.trim() || "";

    if (!receiverId || !requestedSkillId) return null;
    return {
      receiverId,
      requestedSkillId,
      requestedSkillName: requestedSkillName || undefined,
    } satisfies RequestSkillContext;
  }, [location.search]);

  const [requestContext, setRequestContext] = useState<RequestSkillContext | null>(null);
  const [isLoadingRequestContext, setIsLoadingRequestContext] = useState<boolean>(!queryContext);
  const [requestContextError, setRequestContextError] = useState<string | null>(null);
  const resolvedRequestContext = queryContext ?? requestContext;
  const isPreparingRequestContext = queryContext ? false : isLoadingRequestContext;
  const visibleRequestContextError = queryContext ? null : requestContextError;

  useEffect(() => {
    if (queryContext) return;

    let isMounted = true;

    const resolveRequestContext = async () => {
      setIsLoadingRequestContext(true);
      setRequestContextError(null);

      const endpoints = [
        "/api/v1/skills/recommended-user",
        "/api/v1/skills/discover",
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await axiosInstance.get(endpoint);
          const candidates = extractCandidates(response.data);
          if (candidates.length > 0) {
            if (!isMounted) return;
            setRequestContext(candidates[0]);
            setIsLoadingRequestContext(false);
            return;
          }
        } catch (error) {
          console.error(`[Explore] Failed to resolve context from ${endpoint}:`, error);
        }
      }

      if (!isMounted) return;
      setRequestContext(null);
      setRequestContextError("No available skill provider found right now.");
      setIsLoadingRequestContext(false);
    };

    resolveRequestContext();

    return () => {
      isMounted = false;
    };
  }, [queryContext]);

  const handleNavigateToRequest = () => {
    if (!resolvedRequestContext) {
      setRequestContextError("No available skill provider found right now.");
      return;
    }

    navigate("/request-skill", {
      state: resolvedRequestContext,
    });
  };

  return (
    <div className="bg-white flex flex-col items-center">
      <Header />
      <div className="w-full max-w-6xl px-20 py-8 flex flex-col gap-8">
        <SkillInformationCard />
        <SessionDetails />
        <ProviderCard />
        <Reviews />

        <div className="flex flex-col items-end gap-2 mb-4">
          <button
            type="button"
            onClick={handleNavigateToRequest}
            disabled={isPreparingRequestContext}
            className="bg-primary text-white rounded-[10px] px-8 py-3 font-medium hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPreparingRequestContext ? "Preparing..." : "Request Skill Swap"}
          </button>
          {visibleRequestContextError ? (
            <p className="text-xs text-[#dc2626]">{visibleRequestContextError}</p>
          ) : null}
        </div>

        <SimilarSkills />
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
