export const isPermissionDeniedError = (error) =>
  error?.code === "permission-denied" ||
  error?.code === "firestore/permission-denied";

export const getAuthErrorMessage = (error) => {
  switch (error?.code) {
    case "auth/invalid-credential":
      return "That email/password pair does not match a Firebase Authentication user for this project yet. Double-check the password, or create/reset the admin user in Firebase Authentication.";
    case "auth/invalid-email":
      return "That email address format does not look valid yet.";
    case "auth/user-disabled":
      return "This Firebase Authentication user has been disabled.";
    case "auth/too-many-requests":
      return "Too many login attempts for now. Please wait a bit, then try again.";
    case "auth/network-request-failed":
      return "The app could not reach Firebase Authentication. Check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password login is not enabled in Firebase Authentication for this project yet.";
    default:
      return error?.message || "Unable to sign in.";
  }
};

export const isStorageUnavailableError = (error) =>
  error?.code === "storage/unknown" ||
  error?.code === "storage/bucket-not-found" ||
  error?.code === "storage/project-not-found" ||
  error?.message?.includes("XMLHttpRequest") ||
  error?.message?.includes("CORS") ||
  error?.message?.includes("firebasestorage.googleapis.com");

export const getAdminSetupMessage = (uid) =>
  [
    "Firebase Authentication worked, but Firestore is still blocking the admin lookup.",
    "Deploy the firestore rules for project portfolio-demol, then create the admin document",
    uid ? `admins/${uid}` : "admins/{uid}",
    "and try the login again."
  ].join(" ");

export const getStorageSetupMessage = () =>
  [
    "Firebase Storage is not fully initialized for project portfolio-demol yet.",
    "Open Firebase Console > Storage, finish Get Started, choose the permanent bucket region,",
    "then deploy storage.rules."
  ].join(" ");

export const getAuthSetupMessage = () =>
  [
    "Open Firebase Console > Authentication > Users.",
    "Make sure your admin email exists there as a real Email/Password user,",
    "then use that exact password here or reset it from Firebase if needed."
  ].join(" ");
