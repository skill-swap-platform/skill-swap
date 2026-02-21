import type { TrendingItem } from "@/types/home.types";
import IconBadge from "./IconBadge";

type Props = {
  item: TrendingItem;
};

export default function TrendingCard({ item }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <IconBadge icon={item.icon} tone="gray" />
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
          {item.growthLabel}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{item.learningCount} Learning</p>
    </div>
  );
}