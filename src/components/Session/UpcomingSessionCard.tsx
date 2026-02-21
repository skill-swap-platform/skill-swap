import docIcon from "../../assets/session/doc.svg";
import calendarIcon from "../../assets/session/calendar.svg";
import clockIcon from "../../assets/session/clock.svg";
import closeIcon from "../../assets/close-circle.svg";

/* =======================
   Types
======================= */

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

/* =======================
   Utils
======================= */

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/* =======================
   IconWrap (IMG based)
======================= */

type IconWrapProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

function IconWrap({
  src,
  alt,
  className,
  imgClassName,
}: IconWrapProps) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn("h-5 w-5 object-contain", imgClassName)}
      />
    </div>
  );
}

/* =======================
   Close Icon (still SVG)
======================= */

/* =======================
   Main Component
======================= */

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
    <div className="my-6 mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-sm">
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
        <img src={closeIcon} alt="close-circle"/>
        </button>
      </div>

      {/* Info Rows */}
      <div className="px-5">
        <InfoRow
          iconSrc={docIcon}
          iconAlt="session title"
          label="Session Title"
          value={sessionTitle}
        />

        <div className="mt-3">
          <InfoRow
            iconSrc={calendarIcon}
            iconAlt="calendar"
            label="Date"
            value={dateLabel}
          />
        </div>

        <div className="mt-3">
          <InfoRow
            iconSrc={clockIcon}
            iconAlt="clock"
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

/* =======================
   InfoRow
======================= */

function InfoRow({
  iconSrc,
  iconAlt,
  label,
  value,
}: {
  iconSrc: string;
  iconAlt: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <IconWrap src={iconSrc} alt={iconAlt} />

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
