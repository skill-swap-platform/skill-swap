import type { InterestItem } from "@/types/home.types";
import IconBadge from "./IconBadge";
import clsx from "clsx";

type Props = {
  item: InterestItem;
  onClick?: (id: string) => void;
};

export default function InterestChip({ item, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item.id)}
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition",
        item.selected
          ? "border-blue-500 bg-blue-500 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      )}
    >
      <IconBadge
        icon={item.icon}
        tone={item.selected ? "gray" : "gray"}
        className={clsx(item.selected && "bg-white/20 text-white")}
      />
      {item.label}
    </button>
  );
}