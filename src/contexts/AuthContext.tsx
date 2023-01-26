import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
};

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logout = async () => {
    setUser(null);
    return await signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const _user = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        } as Omit<User, "uid">;
        await setDoc(doc(db, "users", user.uid), _user);
        setUser({ uid: user.uid, ..._user });
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
