import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";

export const useDocument = (
  collectionName,
  documentId,
  fallbackData = null,
  options = {}
) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(hasFirebaseConfig);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setData(fallbackData);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(options.fallbackWhenMissing === false ? null : fallbackData);
        }

        setError(null);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError);
        setData(fallbackData);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, documentId]);

  return { data, loading, error };
};
