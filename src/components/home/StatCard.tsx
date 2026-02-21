import type { StatCardItem } from "@/types/home.types";
import IconBadge from "./IconBadge";

type Props = {
  item: StatCardItem;
};

const colorMap = {
  blue: "bg-blue-600 text-white",
  orange: "bg-orange-400 text-white",
  green: "bg-emerald-500 text-white",
} as const;

export default function StatCard({ item }: Props) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm ${colorMap[item.color]}`}>
      <div className="mb-3">
        <IconBadge icon={item.icon} tone="gray" className="bg-white/20 text-white" />
      </div>

      <div className="text-3xl font-bold">
        {item.value} <span className="text-xl font-semibold">{item.title}</span>
      </div>

      <p className="mt-1 text-sm text-white/90">{item.subtitle}</p>
    </div>
  );
}