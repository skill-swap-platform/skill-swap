// src/pages/NotFound.tsx
import React from "react";

type NotFoundPageProps = {
  onBackHome?: () => void;
  homeHref?: string;
};

type BackgroundBlobProps = {
  className?: string;
};

const BackgroundBlob: React.FC<BackgroundBlobProps> = ({ className = "" }) => {
  return (
    <div
      className={[
        "absolute rounded-full blur-3xl opacity-40 pointer-events-none",
        className,
      ].join(" ")}
      aria-hidden="true"
    />
  );
};

const NotFoundContent: React.FC<NotFoundPageProps> = ({
  onBackHome,
  homeHref = "/",
}) => {
  const button = (
    <button
      type="button"
      onClick={onBackHome}
      className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full
                 bg-[#2f6d8d] px-6 text-sm font-medium text-white shadow-lg shadow-slate-300/70
                 transition hover:bg-[#285f7a] active:scale-[0.99]"
    >
      Back to Home
    </button>
  );

  return (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center">
      <h1 className="text-7xl font-light tracking-tight text-[#2f5f79] md:text-8xl">
        404
      </h1>

      <p className="mt-3 text-2xl font-medium text-[#2f5f79]">Page Not Found.</p>

      <p className="mt-4 max-w-md text-sm text-slate-500 md:text-base">
        Sorry, we can&apos;t find the page you&apos;re looking for.
      </p>

      <div className="mt-8">
        {onBackHome ? (
          button
        ) : (
          <a href={homeHref} className="inline-block">
            {button}
          </a>
        )}
      </div>
    </div>
  );
};

const NotFound: React.FC<NotFoundPageProps> = (props) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7fb]">
      {/* Soft background blobs (to match the screenshot style) */}
      <BackgroundBlob className="right-[-120px] top-[-40px] h-40 w-40 bg-cyan-200/70" />
      <BackgroundBlob className="right-[-200px] bottom-[-180px] h-[420px] w-[420px] bg-cyan-200/80" />
      <BackgroundBlob className="right-[120px] bottom-[110px] h-16 w-16 bg-sky-200/70" />
      <BackgroundBlob className="left-[22%] bottom-[80px] h-12 w-12 bg-violet-200/60" />
      <BackgroundBlob className="left-[60%] bottom-[140px] h-10 w-10 bg-cyan-200/60" />

      {/* Extra soft white glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),transparent_65%)]"
      />

      <div className="flex min-h-screen items-center justify-center">
        <NotFoundContent {...props} />
      </div>
    </main>
  );
};

export default NotFound;