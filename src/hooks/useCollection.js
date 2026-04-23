import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, hasFirebaseConfig } from "../firebase/config";

export const useCollection = (
  collectionName,
  options = {},
  fallbackData = []
) => {
  const [data, setData] = useState(hasFirebaseConfig ? [] : fallbackData);
  const [loading, setLoading] = useState(hasFirebaseConfig);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setData(fallbackData);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const collectionRef = collection(db, collectionName);
    const collectionQuery = options.field
      ? query(collectionRef, orderBy(options.field, options.direction || "asc"))
      : collectionRef;

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        const documents = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data()
        }));

        if (!documents.length && options.fallbackWhenEmpty) {
          setData(fallbackData);
        } else {
          setData(documents);
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
  }, [collectionName, options.direction, options.fallbackWhenEmpty, options.field]);

  return { data, loading, error };
};
