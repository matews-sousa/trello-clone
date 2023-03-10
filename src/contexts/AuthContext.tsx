import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
};

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
  signUp: (
    displayName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signUp = async (
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await setDoc(doc(db, "users", userCredentials.user.uid), {
      displayName,
      email,
      photoURL: userCredentials.user.photoURL,
    });
    setUser({
      id: userCredentials.user.uid,
      displayName,
      email,
      photoURL: userCredentials.user.photoURL,
    });
    return await updateProfile(userCredentials.user, {
      displayName,
    });
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    return await signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        const _user = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        } as Omit<User, "id">;
        await setDoc(doc(db, "users", user.uid), _user);
        setUser({ id: user.uid, ..._user });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const value = {
    user,
    isLoading,
    logout,
    signInWithGoogle,
    signInWithGithub,
    signUp,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
