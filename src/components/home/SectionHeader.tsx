import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionClick,
}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      {actionLabel ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}