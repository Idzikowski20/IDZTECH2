import React, { lazy, Suspense, memo } from "react";
import { useTheme } from "next-themes"

const Sparkles = lazy(() => import("@/components/ui/sparkles").then(mod => ({ default: mod.Sparkles })));

// Memoize logo components to prevent unnecessary re-renders
const Retool = memo(() => (
  <svg viewBox="0 0 180 56" fill="currentColor" className="w-full">
    <path d="M34 18.2a2.2 2.2 0 012.2-2.2h8.6a2.2 2.2 0 012.2 2.2v1.7a1.1 1.1 0 01-1.1 1.1H35.1a1.1 1.1 0 01-1.1-1.1v-1.7zM34 25.1a1.1 1.1 0 011.1-1.1h20.7a2.2 2.2 0 012.2 2.2v5.7a1.1 1.1 0 01-1.1 1.1H36.2a2.2 2.2 0 01-2.2-2.2v-5.7zM45 37.1a1.1 1.1 0 011.1-1.1h10.8a1.1 1.1 0 011.1 1.1v.7a2.2 2.2 0 01-2.2 2.2h-8.6a2.2 2.2 0 01-2.2-2.2v-.7z" />
  </svg>
));

const Vercel = memo(() => (
  <svg viewBox="0 0 180 54" fill="currentColor" className="w-full">
    <path d="M89.515 20.5c-4.424 0-7.614 2.925-7.614 7.313 0 4.387 3.59 7.312 8.014 7.312 2.673 0 5.03-1.072 6.488-2.88l-3.066-1.796c-.81.898-2.04 1.422-3.422 1.422-1.919 0-3.55-1.016-4.155-2.64h11.228c.088-.456.14-.927.14-1.423 0-4.383-3.19-7.308-7.613-7.308zm-3.791 5.89c.5-1.62 1.871-2.64 3.787-2.64 1.919 0 3.29 1.02 3.786 2.64h-7.573z" />
  </svg>
));

const Remote = memo(() => (
  <svg viewBox="0 0 180 56" fill="currentColor" className="w-full">
    <path d="M51.1294 35.0449H51.4609V41H50.4859C44.1484 41 40.4825 37.3997 40.4825 31.503V28.4671L42.5495 27.9416C43.1539 27.7859 43.6999 27.4746 44.1289 27.0269C44.5579 26.5793 44.8504 26.015 44.9869 25.4117C45.1234 24.8084 45.0649 24.1662 44.8504 23.5823C44.6359 22.9985 44.2654 22.4925 43.7779 22.1033C43.2905 21.7141 42.7055 21.4805 42.0815 21.4222C41.4575 21.3638 40.8335 21.4611 40.2875 21.7335C39.722 22.006 39.254 22.4341 38.9225 22.9596C38.591 23.485 38.4155 24.0883 38.4155 24.7111V37.6916H32V24.497C32 24.1078 32.0195 23.6991 32.078 23.3099C32.6825 18.6198 36.7775 15 41.7305 15C46.2349 15 50.0179 17.9775 51.1294 22.0254C51.7144 24.1467 51.5194 26.4042 50.6029 28.4087C49.8229 30.1018 48.5554 31.5225 46.9759 32.4955C47.5219 34.6557 48.6334 35.0449 51.1294 35.0449z" />
  </svg>
));

const Arc = memo(() => (
  <svg viewBox="0 0 180 56" fill="currentColor" className="w-full">
    <path d="M133.969 31.642a.918.918 0 00-.673.287c-.909.938-2.098 1.51-3.483 1.51a4.803 4.803 0 01-2.232-.546c-1.814-.947-2.987-3.015-2.661-5.319.356-2.529 2.567-4.411 5.045-4.338 1.322.04 2.457.604 3.334 1.509a.914.914 0 00.672.286c.554 0 1.029-.49 1.029-1.02 0-.247-.078-.53-.278-.735a6.742 6.742 0 00-4.277-2.055c-3.913-.348-7.435 2.84-7.557 6.886-.122 4.066 3.01 7.374 6.925 7.374 1.94 0 3.642-.777 4.909-2.081.198-.204.278-.49.278-.734-.002-.533-.478-1.023-1.031-1.023z" />
  </svg>
));

const Raycast = memo(() => (
  <svg viewBox="0 0 180 56" fill="currentColor" className="w-full">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.292 33.307v3.443L26 28.5l1.731-1.723 6.56 6.53zm3.46 3.443h-3.46L42.583 45l1.732-1.723-6.563-6.527zm19.68-6.527l1.73-1.723L42.58 12l-1.727 1.727 6.56 6.527h-3.964l-4.58-4.547-1.73 1.723 2.847 2.833h-1.99V33.07h12.871v-1.98l2.848 2.834 1.732-1.723-4.58-4.556V23.7l6.565 6.523z"
    ></path>
  </svg>
));

// Memoize the entire Demo component
export const Demo = memo(() => {
  const { theme } = useTheme()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="h-70 w-full">
      <div className="mx-auto mt-32 w-full max-w-2xl">
        <div className="text-center text-3xl text-foreground">
          <span className="text-indigo-900 dark:text-indigo-200">
            Marki, które nam zaufały.
          </span>
          <br />
          <span>Wybrali nas ci, którzy wymagają więcej</span>
        </div>

        <div className="mt-14 grid grid-cols-5 text-zinc-900 dark:text-white">
          <Retool />
          <Vercel />
          <Remote />
          <Arc />
          <Raycast />
        </div>
      </div>

      <div className="relative -mt-32 h-96 w-full">
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-zinc-900/20 dark:border-white/20 bg-white dark:bg-zinc-900" />
        <Suspense fallback={null}>
          <Sparkles
            density={isMobile ? 50 : 200}
            className="absolute inset-x-0 bottom-0 h-full w-full"
            color={theme === "dark" ? "#ffffff" : "#000000"}
          />
        </Suspense>
      </div>
    </div>
  )
});
