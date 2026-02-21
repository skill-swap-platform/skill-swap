type Props = {
  userName: string;
  subtitle: string;
};

export default function HeroSection({ userName, subtitle }: Props) {
  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
        Hi {userName}
      </h1>
      <p className="mt-3 text-base text-slate-500 md:text-lg">{subtitle}</p>
    </header>
  );
}
