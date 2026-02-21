/* eslint-disable no-console */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  saveGameStateToCloud: (state: unknown) => Promise<void>;
  loadGameStateFromCloud: () => Promise<unknown | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Option to ensure user profile exists in db
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            displayName: currentUser.displayName || 'Anonymous',
            createdAt: Date.now(),
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const saveGameStateToCloud = async (state: unknown) => {
    if (!user) {
      return;
    }
    try {
      const stateRef = doc(db, 'saves', user.uid);
      await setDoc(stateRef, state);
    } catch (e) {
      console.error('Error saving strictly to cloud', e);
    }
  };

  const loadGameStateFromCloud = async () => {
    if (!user) {
      return null;
    }
    try {
      const stateRef = doc(db, 'saves', user.uid);
      const stateSnap = await getDoc(stateRef);
      if (stateSnap.exists()) {
        return stateSnap.data();
      }
    } catch (e) {
      console.error('Error loading strictly from cloud', e);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        saveGameStateToCloud,
        loadGameStateFromCloud,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
