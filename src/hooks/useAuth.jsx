import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "../firebase/config";
import { isPermissionDeniedError } from "../utils/firebaseErrors";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminCheckError, setAdminCheckError] = useState(null);
  const [loading, setLoading] = useState(hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setAdminProfile(null);
        setAdminCheckError(null);
        setLoading(false);
        return;
      }

      setUser(nextUser);
      setLoading(true);

      try {
        const adminSnapshot = await getDoc(doc(db, "admins", nextUser.uid));
        setAdminProfile(
          adminSnapshot.exists()
            ? { id: adminSnapshot.id, ...adminSnapshot.data() }
            : null
        );
        setAdminCheckError(null);
      } catch (error) {
        setAdminProfile(null);
        setAdminCheckError(error);

        if (!isPermissionDeniedError(error)) {
          console.error("Failed to fetch admin profile", error);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      adminProfile,
      adminCheckError,
      isAdmin: Boolean(adminProfile),
      loading,
      hasFirebaseConfig,
      login: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),
      logout: () => signOut(auth)
    }),
    [adminCheckError, adminProfile, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
