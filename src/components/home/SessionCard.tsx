import { CalendarDays, Clock3 } from "lucide-react";
import type { SessionItem } from "@/types/home.types";

type Props = {
  item: SessionItem;
};

const levelStyles = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-purple-100 text-purple-700",
} as const;

export default function SessionCard({ item }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-52 w-full">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
          {item.category}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-500">With {item.mentorName}</p>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-medium ${levelStyles[item.level]}`}>
            {item.level}
          </span>
        </div>

        <div className="mb-4 space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{item.dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            <span>{item.timeLabel}</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}