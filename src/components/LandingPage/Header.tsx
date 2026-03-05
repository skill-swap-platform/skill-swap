import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type SectionLink = {
  label: string;
  sectionId: string;
};

type HeaderProps = {
  links?: SectionLink[];
  signInPath?: string;
  getStartedPath?: string;
  homePath?: string;
};

export default function Header({
  links,
  signInPath = "/auth/login",
  getStartedPath = "/auth/register",
  homePath = "/",
}: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () =>
      links ?? [
        { label: "About", sectionId: "about" },
        { label: "Browse Skills", sectionId: "browse-skills" },
        { label: "How it works", sectionId: "how-it-works" },
      ],
    [links],
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to={homePath} aria-label="Go to home">
          <div className="flex w-[304px] flex-shrink-0 text-center text-2xl">
            <span className="font-poppins font-normal text-warning">Skill</span>
            <span className="font-poppins font-bold text-primary">Swap</span>
            <span className="font-poppins font-bold text-warning">.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => scrollToSection(item.sectionId)}
              className="text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to={signInPath}
            className="rounded bg-transparent px-4 py-2 text-[#3E8FCC] font-bold"
          >
            Sign In
          </Link>

          <Link
            to={getStartedPath}
            className="rounded border bg-[#3E8FCC] px-4 py-2 text-white border-none"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Open menu"
        >
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            {navLinks.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="rounded-md px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(signInPath);
                }}
                className="text-sm font-medium text-blue-600"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(getStartedPath);
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
