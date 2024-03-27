import { useEffect, useState } from "react";

const getMatches = (query: string): boolean => {
  // Prevents SSR issues
  if (typeof window !== "undefined") {
    return window.matchMedia(query).matches;
  }
  return false;
};

export default function useMediaQuery(width: number): boolean {
  const query = `(min-width: ${width}px)`;

  const [matches, setMatches] = useState<boolean>(getMatches(query));
  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

// export default function useMediaQuery(width: number) {
//   const [outcome, setOutcome] = useState<boolean>(true);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const getMatch = window?.matchMedia(`max-width: ${width}px`).matches;
//       setOutcome(getMatch);
//     }
//   }, [width]);

//   if (typeof window !== "undefined") {
//     window.addEventListener("resize", (e) => {
//       const windowWidth = document.body.clientWidth;
//       const result = windowWidth >= width;

//       setOutcome(result);
//     });
//   }

//   return outcome;
// }
