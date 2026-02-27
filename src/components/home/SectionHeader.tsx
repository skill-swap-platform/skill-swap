import { ChevronRight, ChevronUp } from "lucide-react";

type Props = {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  expanded?: boolean;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionClick,
  expanded,
}: Props) {
  const label = expanded ? "Show less" : actionLabel;

  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

      {label ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          {label}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      ) : null}
    </div>
  );
}