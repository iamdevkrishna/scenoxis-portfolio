import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, where, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export type CustomBrand = {
  id: string;
  name: string;
  logo: string;
  createdAt?: any;
};

export type CustomVideo = {
  id: string; // doc ID
  type: 'showreel' | 'work';
  title: string;
  client: string;
  video: string;
  poster: string;
  embedUrl: string;
  format: '16:9' | '9:16';
  category: string;
  tags: string[];
  code: string;
  isTopShowreel: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToVideos = (type: 'showreel' | 'work', callback: (videos: CustomVideo[]) => void) => {
  const q = query(collection(db, 'videos'), where('type', '==', type));
  
  return onSnapshot(q, (snapshot) => {
    const videos: CustomVideo[] = [];
    snapshot.forEach((docSnap) => {
      videos.push({ id: docSnap.id, ...docSnap.data() } as CustomVideo);
    });
    callback(videos);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'videos');
  });
};

export const subscribeToAllVideos = (callback: (videos: CustomVideo[]) => void) => {
  const q = collection(db, 'videos'); // Only documents where type in ['showreel', 'work'] can be listed (but we have to filter explicitly up there if rule needs it, actually rules say `existing().type in ...`. For explicit queries, we might need an explicit query if rules demand it. 
  const qfilter = query(q, where('type', 'in', ['showreel', 'work']));
  return onSnapshot(qfilter, (snapshot) => {
    const videos: CustomVideo[] = [];
    snapshot.forEach((docSnap) => {
      videos.push({ id: docSnap.id, ...docSnap.data() } as CustomVideo);
    });
    callback(videos);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'videos');
  });
};

export const addCustomVideo = async (videoData: Partial<CustomVideo>) => {
  const newId = videoData.id || Date.now().toString();
  const docRef = doc(db, 'videos', newId);
  try {
    await setDoc(docRef, {
      ...videoData,
      isTopShowreel: videoData.isTopShowreel ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'videos');
  }
};

export const updateCustomVideo = async (id: string, videoData: Partial<CustomVideo>) => {
  const docRef = doc(db, 'videos', id);
  try {
    // Wait for the get to ensure we don't overwrite createdAt if possible, but actually we use updateDoc
    // Note: setDoc with merge: true is fine too if we are careful, but wait, rules say createdAt == existing().createdAt
    // So if we don't send createdAt, does it work? No, because `incoming().createdAt == existing().createdAt` and `affectedKeys.hasOnly(...)` DOES NOT contain `createdAt`.
    // Wait, the rule says `affectedKeys().hasOnly([...])` without `createdAt`. We should just not include `createdAt` in the update payload.
    await setDoc(docRef, {
      ...videoData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'videos');
  }
};

export const deleteCustomVideo = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'videos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'videos');
  }
};

export const subscribeToAllBrands = (callback: (brands: CustomBrand[]) => void) => {
  const q = collection(db, 'brands');
  return onSnapshot(q, (snapshot) => {
    const brands: CustomBrand[] = [];
    snapshot.forEach((docSnap) => {
      brands.push({ id: docSnap.id, ...docSnap.data() } as CustomBrand);
    });
    callback(brands);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'brands');
  });
};

export const addCustomBrand = async (brandData: Partial<CustomBrand>) => {
  const newId = brandData.id || Date.now().toString();
  const docRef = doc(db, 'brands', newId);
  try {
    await setDoc(docRef, {
      name: brandData.name,
      logo: brandData.logo,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'brands');
  }
};

export const deleteCustomBrand = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'brands', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'brands');
  }
};

export type AppSettings = {
  completedProjectsCount: number;
  updatedAt?: any;
};

export const subscribeToSettings = (callback: (settings: AppSettings | null) => void) => {
  const docRef = doc(db, 'settings', 'general');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AppSettings);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'settings');
  });
};

export const updateSettings = async (settingsData: Partial<AppSettings>) => {
  const docRef = doc(db, 'settings', 'general');
  try {
    await setDoc(docRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'settings');
  }
};

export type AdminSettings = {
  allowedEmails: string[];
  updatedAt?: any;
};

export const subscribeToAdminEmails = (callback: (emails: string[] | null) => void) => {
  const docRef = doc(db, 'settings', 'admins');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().allowedEmails as string[]);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'settings');
  });
};

export const updateAdminEmails = async (allowedEmails: string[]) => {
  const docRef = doc(db, 'settings', 'admins');
  try {
    await setDoc(docRef, {
      allowedEmails,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'settings');
  }
};

// Validation startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
