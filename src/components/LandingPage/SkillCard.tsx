import React from "react";

type SkillCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
};

export function SkillCard({
  title,
  imageSrc,
  imageAlt = "",
  onClick,
  className = "",
}: SkillCardProps) {
  const Wrapper: React.ElementType = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "w-full max-w-sm rounded-2xl bg-white shadow-lg",
        onClick
          ? "cursor-pointer transition hover:shadow-xl active:scale-[0.99]"
          : "",
        className,
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={imageAlt || title}
          className="h-56 w-full rounded-2xl object-cover"
          loading="lazy"
        />

        {/* Floating label */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          <div className="rounded-xl bg-white px-10 py-3 shadow-md">
            <span className="text-lg font-semibold text-blue-600">{title}</span>
          </div>
        </div>
      </div>

      {/* Spacer to make room for the floating label */}
      <div className="h-12" />
    </Wrapper>
  );
}
