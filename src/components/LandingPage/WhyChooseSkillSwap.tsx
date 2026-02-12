import ConnectionIcon from "../../assets/landingPage/connections.svg";
import PeopleIcon from "../../assets/landingPage/people.svg";
import AccessibleIcon from "../../assets/landingPage/accessible.svg";

type Feature = {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
};

export default function WhyChooseSkillSwap() {
  const features: Feature[] = [
    {
      title: "Learn From Real People",
      description:
        "Connect with others to exchange practical skills and gain real-world experience through collaboration",
      iconSrc: PeopleIcon,
      iconAlt: "People icon",
    },
    {
      title: "Accessible Learning",
      description:
        "Learn new skills without costs by sharing what you know and learning from the community",
      iconSrc: AccessibleIcon,
      iconAlt: "Accessible learning icon",
    },
    {
      title: "Build Meaningful Connections",
      description:
        "Create valuable connections with people who share your interests and support your learning journey",
      iconSrc: ConnectionIcon,
      iconAlt: "Connections icon",
    },
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
          Why choose Skill Swap
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-100 bg-white px-7 py-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                <img
                  src={f.iconSrc}
                  alt={f.iconAlt}
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-5 text-center text-lg font-semibold text-slate-800">
                {f.title}
              </h3>

              <p className="mx-auto mt-3 max-w-[26ch] text-center text-sm leading-6 text-slate-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
