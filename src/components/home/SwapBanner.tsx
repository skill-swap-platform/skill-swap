import { MessageSquare, Send } from "lucide-react";
import type { SwapBanner as SwapBannerType } from "@/types/home.types";

type Props = {
  item: SwapBannerType;
};

export default function SwapBanner({ item }: Props) {
  return (
    <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <MessageSquare className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-white/90">{item.subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-slate-100"
        >
          {item.ctaLabel}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
