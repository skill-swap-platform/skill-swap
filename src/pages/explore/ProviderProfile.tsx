import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, Header } from "@/components";
import Reviews from "@/components/explore/Reviews";
import { gamificationService } from "@/api/services/gamification.service";
import {
  getProviderProfile,
  getReviews,
  getSkillDetails,
  type ReviewsData,
  type SkillDetailsResponse,
} from "@/api/extended-services";

type SimpleSkill = {
  id: string;
  name: string;
};

type BadgeDef = {
  key: string;
  name: string;
  sessions: number;
  iconSrc: string;
  iconBg: string;
};

const BADGE_DEFS: BadgeDef[] = [
  {
    key: "first-exchange",
    name: "First Exchange",
    sessions: 1,
    iconSrc: "https://www.figma.com/api/mcp/asset/bc5ba004-145a-4711-a146-c5a726ea6b56",
    iconBg: "bg-[rgba(62,143,204,0.1)]",
  },
  {
    key: "active-member",
    name: "Active Member",
    sessions: 10,
    iconSrc: "https://www.figma.com/api/mcp/asset/8266a953-6a21-4620-b545-d9d28cef4c76",
    iconBg: "bg-[rgba(52,199,89,0.1)]",
  },
  {
    key: "skill-exchanger",
    name: "Skill Exchanger",
    sessions: 25,
    iconSrc: "https://www.figma.com/api/mcp/asset/136a25a0-5a89-4741-a00c-f692f6ce0404",
    iconBg: "bg-[rgba(0,199,190,0.1)]",
  },
  {
    key: "experienced",
    name: "Experienced",
    sessions: 50,
    iconSrc: "https://www.figma.com/api/mcp/asset/3884ccac-b318-4464-94b0-4d625e5e9e54",
    iconBg: "bg-[rgba(88,86,214,0.1)]",
  },
  {
    key: "core-contributor",
    name: "Core Contributor",
    sessions: 80,
    iconSrc: "https://www.figma.com/api/mcp/asset/6ce4e1f3-eb03-4bdb-bd94-c95592792f37",
    iconBg: "bg-[rgba(255,204,0,0.1)]",
  },
];

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeKey = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const getBadgeNamesFromPayload = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (!isRecord(item)) {
          return "";
        }

        const rawName = item.name ?? item.badgeName ?? item.title ?? item.id;
        return typeof rawName === "string" ? rawName : "";
      })
      .filter(Boolean);
  }

  if (!isRecord(payload)) {
    return [];
  }

  return Object.entries(payload)
    .filter(([, value]) => {
      if (typeof value === "boolean") {
        return value;
      }

      if (!isRecord(value)) {
        return false;
      }

      return Boolean(value.unlocked ?? value.isUnlocked ?? value.awarded);
    })
    .map(([key, value]) => {
      if (isRecord(value) && typeof value.name === "string") {
        return value.name;
      }

      return key;
    });
};

const extractSkills = (payload: unknown): SimpleSkill[] => {
  if (!isRecord(payload)) {
    return [];
  }

  const candidates: unknown[] = [
    payload.skills,
    payload.offeredSkills,
    payload.userSkills,
    isRecord(payload.data) ? payload.data.skills : null,
    isRecord(payload.data) ? payload.data.offeredSkills : null,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const normalized = candidate
      .map((item) => {
        if (!isRecord(item)) {
          return null;
        }

        const skillRecord = isRecord(item.skill) ? item.skill : item;
        const idRaw = skillRecord.id ?? skillRecord.skillId ?? item.id ?? item.userSkillId;
        const nameRaw = skillRecord.name ?? item.name;
        const id = typeof idRaw === "string" ? idRaw : "";
        const name = typeof nameRaw === "string" ? nameRaw : "";

        if (!name) {
          return null;
        }

        return { id, name } as SimpleSkill;
      })
      .filter((item): item is SimpleSkill => item !== null);

    if (normalized.length > 0) {
      const deduped = normalized.filter(
        (item, index, array) =>
          index === array.findIndex((entry) => entry.id === item.id && entry.name === item.name),
      );
      return deduped;
    }
  }

  return [];
};

const ProviderBadgeIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 22"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M7.00195 0C7.25194 0.000122364 7.48641 0.120892 7.63184 0.324219L9.97461 3.60449L13.2148 4.53027C13.4666 4.60238 13.6651 4.79655 13.7422 5.04688C13.8193 5.29734 13.7645 5.57015 13.5967 5.77148L11.3125 8.5127L11.7705 12.1787C11.8042 12.4479 11.6944 12.7157 11.4814 12.8838C11.2686 13.0516 10.9833 13.0961 10.7295 13.001L8 11.9766V16.0234H10C10.9665 16.0234 11.75 16.8069 11.75 17.7734V19.7734H13C13.5523 19.7734 14 20.2212 14 20.7734C14 21.3257 13.5523 21.7734 13 21.7734H1C0.447715 21.7734 0 21.3257 0 20.7734C0 20.2212 0.447715 19.7734 1 19.7734H2.25V17.7734C2.25 16.8069 3.0335 16.0234 4 16.0234H6V11.9775L3.27344 13.001C3.01962 13.096 2.73431 13.0516 2.52148 12.8838C2.30854 12.7157 2.19877 12.4479 2.23242 12.1787L2.69043 8.5127L0.40625 5.77148C0.238486 5.57017 0.183622 5.29732 0.260742 5.04688C0.337917 4.7964 0.537049 4.60228 0.789062 4.53027L4.02832 3.60449L6.37109 0.324219C6.51659 0.120727 6.75179 0 7.00195 0Z"
      fill="#FFA412"
    />
  </svg>
);

const StarIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 1.8L9.86 5.57L14.02 6.17L11.01 9.1L11.72 13.24L8 11.28L4.28 13.24L4.99 9.1L1.98 6.17L6.14 5.57L8 1.8Z"
      fill="#FFA412"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#141B34]" fill="none" aria-hidden="true">
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { userId = "", skillId = "" } = useParams<{ userId: string; skillId: string }>();

  const [details, setDetails] = useState<SkillDetailsResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [providerSkills, setProviderSkills] = useState<SimpleSkill[]>([]);
  const [badgeNamesFromApi, setBadgeNamesFromApi] = useState<string[]>([]);
  const [badgeCompletedSessions, setBadgeCompletedSessions] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  const hasParams = Boolean(userId && skillId);

  useEffect(() => {
    const loadDetails = async () => {
      if (!hasParams) {
        setDetails(null);
        setProviderSkills([]);
        setBadgeNamesFromApi([]);
        setBadgeCompletedSessions(0);
        setError("Missing provider context");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [detailsRes, publicProfileRes, badgeRes] = await Promise.allSettled([
          getSkillDetails(skillId, userId),
          getProviderProfile(userId),
          gamificationService.getBadges(userId),
        ]);

        if (detailsRes.status === "fulfilled") {
          setDetails(detailsRes.value);
        } else {
          setDetails(null);
          const candidate = detailsRes.reason as { response?: { data?: { message?: string } } };
          setError(candidate?.response?.data?.message || "Failed to load provider profile");
        }

        if (publicProfileRes.status === "fulfilled") {
          setProviderSkills(extractSkills(publicProfileRes.value));
        } else {
          setProviderSkills([]);
        }

        if (badgeRes.status === "fulfilled") {
          const badgeData = badgeRes.value?.data;
          setBadgeNamesFromApi(getBadgeNamesFromPayload(badgeData?.badges));
          setBadgeCompletedSessions(toNumber(badgeData?.completedSessions));
        } else {
          setBadgeNamesFromApi([]);
          setBadgeCompletedSessions(0);
        }
      } catch (err: unknown) {
        const candidate = err as { response?: { data?: { message?: string } } };
        setError(candidate?.response?.data?.message || "Failed to load provider profile");
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
      } catch (err: unknown) {
        const candidate = err as { response?: { data?: { message?: string } } };
        setErrorReviews(candidate?.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    void loadReviews();
  }, [hasParams, skillId, userId]);

  const provider = details?.provider;
  const skill = details?.skill;

  const profileRating = useMemo(() => {
    if (!provider) {
      return 0;
    }
    return toNumber(provider.rating ?? provider.avgRate ?? provider.avarage ?? 0);
  }, [provider]);

  const reviewsCount = useMemo(() => {
    const fromProvider = toNumber(provider?.totalFeedbacks ?? provider?.totalFeedback ?? 0);
    const fromDetails = toNumber(details?.reviews?.count ?? 0);
    return Math.max(fromProvider, fromDetails);
  }, [details?.reviews?.count, provider?.totalFeedback, provider?.totalFeedbacks]);

  const totalSessions = useMemo(() => {
    const detailsSessions = toNumber(details?.countSessions ?? 0);
    return Math.max(detailsSessions, badgeCompletedSessions);
  }, [badgeCompletedSessions, details?.countSessions]);

  const displayedSkills = useMemo(() => {
    if (providerSkills.length > 0) {
      return providerSkills.slice(0, 3);
    }

    if (skill?.name) {
      return [{ id: skill.id || skillId, name: skill.name }];
    }

    return [];
  }, [providerSkills, skill?.id, skill?.name, skillId]);

  const earnedBadges = useMemo(() => {
    const normalizedNameSet = new Set(badgeNamesFromApi.map((name) => normalizeKey(name)));

    const fromNames = BADGE_DEFS.filter((badge) => {
      const byName = normalizedNameSet.has(normalizeKey(badge.name));
      const byKey = normalizedNameSet.has(normalizeKey(badge.key));
      return byName || byKey;
    });

    if (fromNames.length > 0) {
      return fromNames;
    }

    return BADGE_DEFS.filter((badge) => totalSessions >= badge.sessions);
  }, [badgeNamesFromApi, totalSessions]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header activeTab="Explore" />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 py-6 sm:py-8 flex-grow">
        <div className="space-y-8">
          <section className="bg-neutral-background border border-neutral-border rounded-md p-6">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full bg-gray-200 animate-pulse shrink-0 flex-none"
                    style={{ width: 70, height: 70, minWidth: 70, minHeight: 70 }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-44 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ) : error ? (
              <div>
                <p className="text-red-600 font-semibold">Failed to load provider</p>
                <p className="text-red-500 text-sm mt-2">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full overflow-hidden bg-[#e5e7eb] shrink-0 flex-none"
                    style={{ width: 70, height: 70, minWidth: 70, minHeight: 70 }}
                  >
                    <img
                      src={provider?.image || "https://via.placeholder.com/70"}
                      alt={provider?.userName || "Provider"}
                      className="block h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="text-[#0c0d0f] text-[20px] font-semibold leading-none">
                        {provider?.userName || "Provider"}
                      </p>
                      <ProviderBadgeIcon className="h-6 w-6 shrink-0" />
                    </div>
                    <p className="mt-2 text-[#666] text-base leading-none truncate">
                      {provider?.bio || "No provider bio available."}
                    </p>
                  </div>
                </div>

                <div className="border-l-[1.5px] border-primary pl-2">
                  <p className="text-[#0c0d0f] text-base leading-[1.25]">
                    {details?.skillDescription || "No skill description available."}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-border flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-[13px]">
                    <StarIcon className="h-[14px] w-[14px]" />
                    <p className="text-[#0c0d0f]">{profileRating.toFixed(1)}</p>
                    <p className="text-[#666]">({reviewsCount} reviews)</p>
                  </div>
                  <span className="h-6 rounded-[20px] bg-[rgba(0,122,255,0.15)] px-2 text-primary text-[13px] flex items-center">
                    {totalSessions} Total Sessions
                  </span>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4 px-4 sm:px-6">
            <h2 className="text-[#0c0d0f] text-[24px] font-semibold leading-none">Offered Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {displayedSkills.map((item) => (
                <button
                  type="button"
                  key={`${item.id}-${item.name}`}
                  onClick={() => navigate(`/explore/${item.id || skillId}/${userId}`)}
                  className="w-full bg-white border border-neutral-border rounded-[10px] p-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-[10px] bg-[rgba(62,143,204,0.2)] flex items-center justify-center text-primary text-[20px] font-semibold shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-1 items-center gap-1 min-w-0">
                      <p className="min-w-0 truncate text-[#0c0d0f] text-base leading-none">{item.name}</p>
                      <div className="shrink-0 flex items-center gap-[2px]">
                        <StarIcon className="h-4 w-4" />
                        <p className="text-[#0c0d0f] text-[12px] leading-none">{profileRating.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ArrowRightIcon />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6 px-4 sm:px-6">
            <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Recognition Badges</h2>
            {earnedBadges.length === 0 ? (
              <p className="text-[#666] text-sm">No badges earned yet.</p>
            ) : (
              <div className="flex flex-wrap items-start gap-4 px-4">
                {earnedBadges.map((badge) => (
                  <div key={badge.key} className="w-[88px] flex flex-col items-center justify-center gap-1">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${badge.iconBg}`}>
                      <img src={badge.iconSrc} alt="" className="h-6 w-6" />
                    </div>
                    <p className="text-[#0c0d0f] text-[12px] text-center leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="px-4 sm:px-6">
            <Reviews
              data={reviews}
              loading={loadingReviews}
              error={errorReviews}
              userId={userId}
              skillId={skillId}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
