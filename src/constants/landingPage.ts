import type { HowItWorksStep, SkillCard } from "@/types/landingPage.types";
import programming from "../assets/landingPage/skills/programming.png";
import digital_marketing from "../assets/landingPage/skills/digital-marketing.png";
import financial_modeling from "../assets/landingPage/skills/financial-modeling.png";
import photography from "../assets/landingPage/skills/photography.png";
import public_speaking from "../assets/landingPage/skills/public-speaking.png";
import data_science from "../assets/landingPage/skills/data-science.png";

export const SKILLS: SkillCard[] = [
  {  id: 1 ,title: "programming", imageSrc: programming},
  {  id: 2,title: "Data science", imageSrc: data_science},
  {  id: 3,title: "Financial Marketing", imageSrc: financial_modeling},
  {  id: 4,title: "Public Speaking", imageSrc: public_speaking },
  {  id:5, title: "Digital Marketing", imageSrc:digital_marketing },
  {  id:6,  title: "Photography", imageSrc: photography},
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