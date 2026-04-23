import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";
import {
  clientsSeed,
  heroSeed,
  projectsSeed,
  resumeSeed,
  servicesSeed,
  siteSettingsSeed,
  testimonialsSeed
} from "./defaultContent";

export const seedPortfolioContent = async () => {
  if (!hasFirebaseConfig || !db) {
    throw new Error("Firebase is not configured yet.");
  }

  const batch = writeBatch(db);

  batch.set(doc(db, "siteContent", "hero"), {
    ...heroSeed,
    updatedAt: serverTimestamp()
  });

  batch.set(doc(db, "siteContent", "resume"), {
    ...resumeSeed,
    updatedAt: serverTimestamp()
  });

  batch.set(doc(db, "siteContent", "settings"), {
    ...siteSettingsSeed,
    updatedAt: serverTimestamp()
  });

  servicesSeed.forEach(({ id, ...service }) => {
    batch.set(doc(db, "services", id), {
      ...service,
      updatedAt: serverTimestamp()
    });
  });

  projectsSeed.forEach(({ id, ...project }) => {
    batch.set(doc(db, "projects", id), {
      ...project,
      updatedAt: serverTimestamp()
    });
  });

  testimonialsSeed.forEach(({ id, ...testimonial }) => {
    batch.set(doc(db, "testimonials", id), {
      ...testimonial,
      updatedAt: serverTimestamp()
    });
  });

  clientsSeed.forEach(({ id, ...client }) => {
    batch.set(doc(db, "clients", id), {
      ...client,
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
};
