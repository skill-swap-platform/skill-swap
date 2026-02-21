import React from "react";

type SkillCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
};

export function SkillCard({ title, imageSrc, imageAlt = "" }: SkillCardProps) {
  const Wrapper: React.ElementType = "div";

  return (
    <Wrapper className={"w-full max-w-sm rounded-2xl bg-white shadow-lg my-5"}>
      {/* Image */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={imageAlt || title}
          className="aspect-square w-full rounded-2xl object-cover"
          loading="lazy"
        />

        {/* Floating label */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-8/12 text-center">
          <div className="rounded-xl px-3 py-3 bg-white shadow-md">
            <span className=" text-base font-semibold text-[#3E8FCC]">
              {title}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
