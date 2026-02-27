import type { ReactNode } from "react";
import type { SkillDetailsResponse } from "@/services/exploreService";

interface SessionDetailsProps {
  data?: SkillDetailsResponse | null;
  loading?: boolean;
  error?: string | null;
}

interface DetailCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

const DetailCard = ({ label, value, icon }: DetailCardProps) => (
  <div className="bg-white rounded-[10px] p-4">
    <div className="flex items-center gap-3">
      <div className="h-[50px] w-[50px] rounded-full bg-[rgba(0,122,255,0.15)] text-[#3272a3] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-[#0c0d0f] text-base sm:text-lg font-semibold flex-1 min-w-0">
        {label}
      </p>
      <div className="h-8 rounded-[20px] bg-[#f3f4f6] px-3 sm:px-4 flex items-center justify-center">
        <p className="text-[#666] text-sm sm:text-base font-medium whitespace-nowrap">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const SessionDetails = ({
  data,
  loading = false,
  error = null,
}: SessionDetailsProps) => {
  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Session Details</h2>
        <div className="bg-[#f7faff] rounded-[12px] p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-[10px] p-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-3" />
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Session Details</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-6">
          <p className="text-red-600 font-semibold">Error loading session details</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </section>
    );
  }

  const sessionLanguage = data?.sessionLanguage || "Not specified";
  const level = data?.level || "Not specified";
  const sessionDuration =
    data?.sessions?.[0]?.duration && data.sessions[0].duration > 0
      ? `${data.sessions[0].duration} min`
      : "Not specified";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Session Details</h2>

      <div className="bg-[#f7faff] rounded-[12px] p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <DetailCard
          label="Skill Language"
          value={sessionLanguage}
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20.75C16.8325 20.75 20.75 16.8325 20.75 12C20.75 7.16751 16.8325 3.25 12 3.25C7.16751 3.25 3.25 7.16751 3.25 12C3.25 16.8325 7.16751 20.75 12 20.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 3.5C14.2 5.7 15.45 8.75 15.45 12C15.45 15.25 14.2 18.3 12 20.5C9.8 18.3 8.55 15.25 8.55 12C8.55 8.75 9.8 5.7 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          }
        />

        <DetailCard
          label="Session Duration"
          value={sessionDuration}
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 7.5V12L15 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <DetailCard
          label="Skill Level"
          value={level}
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M8.5 10.5L12 7L15.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 16.5L12 13L15.5 16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="8.75" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
        />
      </div>
    </section>
  );
};

export default SessionDetails;
