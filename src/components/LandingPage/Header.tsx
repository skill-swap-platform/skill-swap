// Header.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
  signInPath = "/signin",
  getStartedPath = "/signup",
  homePath = "/",
}: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo<SectionLink[]>(
    () =>
      links ?? [
        { label: "Browse Skills", sectionId: "browse-skills" },
        { label: "How it works", sectionId: "how-it-works" },
        { label: "About", sectionId: "about" },
      ],
    [links],
  );

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to={homePath} aria-label="Go to home">
          <div className="text-2xl text-center w-[304px] flex-shrink-0">
            <span className="font-poppins font-normal text-warning">Skill</span>
            <span className="font-poppins font-bold text-primary">Swap</span>
            <span className="font-poppins font-bold text-warning">.</span>
          </div>
        </Link>

        {/* Center links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollToSection(item.sectionId)}
              className="text-base font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center justify-center"
          >
            Sign In
          </Link>

          <Link
            to="/auth/register"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded inline-flex items-center justify-center"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {/* simple hamburger */}
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navLinks.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => scrollToSection(item.sectionId)}
                className="rounded-md px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(signInPath);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(getStartedPath);
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
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
