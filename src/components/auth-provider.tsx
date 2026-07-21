"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebase } from "@/lib/firebase/client";

/* ── Firebase error-code → friendly message ── */
function friendlyError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/popup-closed-by-user":
      return "Authentication popup was closed.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Allow popups for this site.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/* ── Password validation (8+ chars, upper, lower, digit, special) ── */
function validatePassword(password: string, email?: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 128) return "Password is too long.";
  if (/\s/.test(password)) return "Password cannot contain spaces.";
  if (!/[A-Z]/.test(password)) return "Password must include at least 1 uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least 1 lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least 1 number.";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password))
    return "Password must include at least 1 special character.";
  if (email && password.toLowerCase().includes(email.split("@")[0].toLowerCase()))
    return "Password should not contain your email.";
  return null;
}

/* ── Context type ── */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signInWithGitHub: () => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  validatePassword: (password: string, email?: string) => string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let unsub = () => {};
    try {
      const { auth } = getFirebase();
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => unsub();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const { auth } = getFirebase();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        await signOut(auth);
        return "Please verify your email before signing in. Check your inbox.";
      }
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? friendlyError((e as { code?: string }).code ?? "") : "Login failed.";
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string): Promise<string | null> => {
      const passwordError = validatePassword(password, email);
      if (passwordError) return passwordError;
      try {
        const { auth } = getFirebase();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) await updateProfile(cred.user, { displayName });
        await sendEmailVerification(cred.user);
        await signOut(auth);
        return null;
      } catch (e: unknown) {
        return e instanceof Error ? friendlyError((e as { code?: string }).code ?? "") : "Signup failed.";
      }
    },
    [],
  );

  const signInWithGoogle = useCallback(async (): Promise<string | null> => {
    try {
      const { auth } = getFirebase();
      await signInWithPopup(auth, new GoogleAuthProvider());
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? friendlyError((e as { code?: string }).code ?? "") : "Google sign-in failed.";
    }
  }, []);

  const signInWithGitHub = useCallback(async (): Promise<string | null> => {
    try {
      const { auth } = getFirebase();
      await signInWithPopup(auth, new GithubAuthProvider());
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? friendlyError((e as { code?: string }).code ?? "") : "GitHub sign-in failed.";
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string): Promise<string | null> => {
    try {
      const { auth } = getFirebase();
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return null;
    } catch (e: unknown) {
      return e instanceof Error ? friendlyError((e as { code?: string }).code ?? "") : "Failed to send reset email.";
    }
  }, []);

  const logout = useCallback(async () => {
    const { auth } = getFirebase();
    await signOut(auth);
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    const { auth } = getFirebase();
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithGitHub,
        sendPasswordReset,
        logout,
        getIdToken,
        validatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { validatePassword };
