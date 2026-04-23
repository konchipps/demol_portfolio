import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, storageUploadsEnabled } from "../firebase/config";
import {
  getStorageSetupMessage,
  isStorageUnavailableError
} from "./firebaseErrors";

const cleanFilename = (filename) =>
  filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-");

export const uploadImage = async (file, folder = "general") => {
  if (!storageUploadsEnabled) {
    throw new Error(getStorageSetupMessage());
  }

  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  const storageRef = ref(
    storage,
    `portfolio/${folder}/${Date.now()}-${cleanFilename(file.name)}`
  );

  try {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    if (isStorageUnavailableError(error)) {
      throw new Error(getStorageSetupMessage());
    }

    throw error;
  }
};
