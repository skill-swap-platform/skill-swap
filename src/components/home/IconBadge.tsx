import {
  ArrowLeftRight,
  Award,
  BarChart3,
  Bot,
  Cloud,
  Globe,
  LineChart,
  Music2,
  PenTool,
  Search,
  Shield,
  Sparkles,
  Star,
  Smartphone,
  UserCheck,
} from "lucide-react";
import type { IconName } from "@/types/home.types";
import clsx from "clsx";

type Props = {
  icon: IconName;
  tone?: "gray" | "blue" | "orange" | "green" | "transparent";
  className?: string;
};

const iconMap = {
  search: Search,
  sparkles: Sparkles,
  "user-check": UserCheck,
  award: Award,
  swap: ArrowLeftRight,
  star: Star,
  globe: Globe,
  "bar-chart": BarChart3,
  music: Music2,
  "pen-tool": PenTool,
  smartphone: Smartphone,
  cloud: Cloud,
  shield: Shield,
  "line-chart": LineChart,
  bot: Bot,
} as const;

const toneClasses = {
  gray: "bg-slate-100 text-slate-500",
  blue: "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
  green: "bg-green-50 text-green-500",
  transparent: "bg-transparent text-white",
};

export default function IconBadge({
  icon,
  tone = "transparent",
  className,
}: Props) {
  const Icon = iconMap[icon];

  return (
    <div
      className={clsx(
        "inline-flex h-7 w-7 items-center justify-center rounded-md",
        toneClasses[tone],
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
