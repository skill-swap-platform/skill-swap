import type { HowItWorksStep, SkillCard } from "@/types/landingPage.types";

export const SKILLS: SkillCard[] = [
  {  id: 1 ,title: "programming", imageSrc: "/assets/landingPage/skills/programming.png"},
  {  id: 2,title: "Data science", imageSrc: "/assets/landingPage/skills/data-science.png"},
  {  id: 3,title: "Financial Marketing", imageSrc: "/assets/landingPage/skills/financial-modeling.png"},
  {  id: 4,title: "Public Speaking", imageSrc: "/assets/landingPage/skills/public-speaking.png" },
  {  id:5, title: "Digital Marketing", imageSrc:"/assets/landingPage/skills/digital-marketing.png" },
  {  id:6,  title: "Photography", imageSrc: "/assets/landingPage/skills/photography.png"},
];

export const DEFAULT_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    title: "Create your profile",
    description: "Choose what you want to learn or teach",
  },
  {
    id: 2,
    title: "Find a Match",
    description: "Connect with others who have complementary skills and interests",
  },
  {
    id: 3,
    title: "Start Swapping",
    description: "Schedule sessions and begin your skill exchange journey",
  },
];