export type SkillCard = {
  id: number,
  title: string;
  imageSrc: string;
  imageAlt?: string;
};

export type HowItWorksStep = {
  id: number;
  title: string;
  description: string;
};

export type HowItWorksProps = {
  title?: string;
  steps?: HowItWorksStep[];
  className?: string;
};