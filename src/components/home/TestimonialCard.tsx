import { Star } from "lucide-react";
import type { TestimonialItem } from "@/types/home.types";

type Props = {
  item: TestimonialItem;
};

export default function TestimonialCard({ item }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: item.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="mb-4 text-sm font-medium leading-6 text-slate-800">“{item.quote}”</p>

      <p className="text-sm font-semibold text-slate-700">{item.name}</p>
      <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
    </div>
  );
}