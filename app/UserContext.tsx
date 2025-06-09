import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type UserContextType = {
  user: any;
  rol: string | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  rol: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(db, 'usuario', firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRol(snap.data().id_rol);
        } else {
          setRol(null);
        }
      } else {
        setRol(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, rol, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);