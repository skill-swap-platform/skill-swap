import { Bookmark, Star } from "lucide-react";
import type { MentorCardItem } from "@/types/home.types";

type Props = {
  item: MentorCardItem;
};

export default function MentorCard({ item }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src={item.mentorAvatar}
            alt={item.mentorName}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{item.mentorName}</h3>
            <p className="text-sm text-slate-500">{item.mentorRole}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
              <span>• {item.reviewCount} reviews</span>
              <span>• {item.swapCount} swaps</span>
            </div>
          </div>
        </div>

        <button type="button" className="text-slate-400 hover:text-slate-600">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <h4 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h4>
      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
}