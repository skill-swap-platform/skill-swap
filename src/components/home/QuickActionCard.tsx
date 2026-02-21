import { ArrowRight } from "lucide-react";
import type { QuickAction } from "@/types/home.types";
import IconBadge from "./IconBadge";

type Props = {
  item: QuickAction;
};

const accentText = {
  blue: "text-blue-600",
  orange: "text-orange-500",
  green: "text-green-600",
} as const;

export default function QuickActionCard({ item }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <IconBadge icon={item.icon} tone={item.accent} />
      </div>

      <h3 className="mb-2 text-xl font-semibold text-slate-900">{item.title}</h3>
      <p className="mb-4 text-sm leading-6 text-slate-500">{item.description}</p>

      <button
        type="button"
        className={`inline-flex items-center gap-2 text-sm font-semibold ${accentText[item.accent]}`}
      >
        {item.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}