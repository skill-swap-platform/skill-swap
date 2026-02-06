import React from "react";

type SessionTip = {
  id: string;
  text: string;
};

type UpcomingSessionCardProps = {
  title?: string;
  category?: string;
  sessionTitle?: string;
  dateLabel?: string;
  timeLabel?: string;
  partnerName?: string;
  partnerSubtitle?: string;
  tips?: SessionTip[];
  onJoin?: () => void;
  onReschedule?: () => void;
  onClose?: () => void;
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function IconWrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3v2M17 3v2M4.5 8.5h15"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v11A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-11A2.5 2.5 0 0 1 6.5 5Z"
        className="stroke-current"
        strokeWidth="1.8"
      />
      <path
        d="M8 12h3M8 15.5h7"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 7v5l3 2"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        className="stroke-current"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DocIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 7h8M8 11h8M8 15h6"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 3.5h7l3.5 3.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5V7h3.5"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 7l10 10M17 7L7 17"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UpcomingSessionCard({
  title = "Upcoming Session",
  category = "Spanish Conversation",
  sessionTitle = "Basic of spanish",
  dateLabel = "Saturday, Dec 16",
  timeLabel = "3:00 PM - 4:00 PM",
  partnerName = "Jane Cooper",
  partnerSubtitle = "Your learning partner",
  tips = [
    { id: "t1", text: "Test your camera and microphone before joining" },
    { id: "t2", text: "Find a quiet space with good lighting" },
    { id: "t3", text: "Prepare any questions or topics to discuss" },
  ],
  onJoin,
  onReschedule,
  onClose,
}: UpcomingSessionCardProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pb-3 pt-5">
        <div>
          <p className="text-[13px] font-semibold text-slate-700">{title}</p>
          <p className="mt-0.5 text-[12px] text-slate-500">{category}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          aria-label="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Info rows */}
      <div className="px-5">
        <InfoRow
          icon={<DocIcon className="h-5 w-5" />}
          label="Session Title"
          value={sessionTitle}
        />
        <div className="mt-3">
          <InfoRow
            icon={<CalendarIcon className="h-5 w-5" />}
            label="Date"
            value={dateLabel}
          />
        </div>
        <div className="mt-3">
          <InfoRow
            icon={<ClockIcon className="h-5 w-5" />}
            label="Time"
            value={timeLabel}
          />
        </div>
      </div>

      {/* Partner */}
      <div className="mt-5 px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700">
            <span className="text-sm font-semibold">
              {partnerName
                .split(" ")
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-slate-800">
              {partnerName}
            </p>
            <p className="text-[12px] text-slate-500">{partnerSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-5 px-5">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[12px] font-semibold text-slate-700">
            Session Tips
          </p>

          <ul className="mt-2 space-y-2">
            {tips.map((tip) => (
              <li key={tip.id} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <p className="text-[12px] leading-5 text-slate-600">
                  {tip.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 px-5 pb-5">
        <button
          type="button"
          onClick={onJoin}
          className="h-11 w-full rounded-xl bg-[#2f6f8d] text-[14px] font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          Join Session
        </button>

        <button
          type="button"
          onClick={onReschedule}
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          Reschedule
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <IconWrap>{icon}</IconWrap>

        <div className="min-w-0">
          <p className="text-[12px] text-slate-500">{label}</p>
          <p className="truncate text-[14px] font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
