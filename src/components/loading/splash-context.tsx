"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SPLASH_SESSION_KEY = "vyaparai_splash_seen";
const MIN_DURATION_MS = 1200;
const MAX_DURATION_MS = 3000;

interface SplashState {
  visible: boolean;
  dismissing: boolean;
  ready: boolean;
}

const SplashContext = createContext<SplashState>({
  visible: false,
  dismissing: false,
  ready: true,
});

export function useSplash() {
  return useContext(SplashContext);
}

export function SplashProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [ready, setReady] = useState(true);

  const minTimerDone = useRef(false);
  const assetsReady = useRef(false);
  const fontsReady = useRef(false);
  const frameRendered = useRef(false);
  const startTime = useRef(0);

  const shouldShowSplash = useRef(false);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY);

    if (prefersReduced || alreadySeen) {
      setVisible(false);
      setReady(true);
      return;
    }

    shouldShowSplash.current = true;
    startTime.current = Date.now();
    setVisible(true);
    setReady(false);
    document.body.classList.add("splash-active");

    const minTimer = setTimeout(() => {
      minTimerDone.current = true;
      checkReady();
    }, MIN_DURATION_MS);

    const maxTimer = setTimeout(() => {
      forceReady();
    }, MAX_DURATION_MS);

    document.fonts.ready.then(() => {
      fontsReady.current = true;
      checkReady();
    });

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      document.body.classList.remove("splash-active");
    };
  }, []);

  function checkReady() {
    if (
      minTimerDone.current &&
      assetsReady.current &&
      fontsReady.current &&
      frameRendered.current
    ) {
      dismiss();
    }
  }

  function forceReady() {
    if (!ready) {
      dismiss();
    }
  }

  const dismiss = useCallback(() => {
    if (!shouldShowSplash.current || dismissing) return;
    setDismissing(true);
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");

    setTimeout(() => {
      setVisible(false);
      setDismissing(false);
      setReady(true);
      document.body.classList.remove("splash-active");
    }, 800);
  }, [dismissing, ready]);

  const markAssetsReady = useCallback(() => {
    assetsReady.current = true;
    checkReady();
  }, []);

  const markFrameRendered = useCallback(() => {
    frameRendered.current = true;
    checkReady();
  }, []);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__splashMarkAssetsReady = markAssetsReady;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__splashMarkFrameRendered = markFrameRendered;
    }
  }, [visible, markAssetsReady, markFrameRendered]);

  return (
    <SplashContext.Provider value={{ visible, dismissing, ready }}>
      {children}
    </SplashContext.Provider>
  );
}
