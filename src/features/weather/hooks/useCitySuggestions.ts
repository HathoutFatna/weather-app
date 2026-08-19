import { useEffect, useState } from "react";
import { useSearchCitiesQuery } from "../api/weatherApi";
import type { Place } from "../domain/models";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export function useCitySuggestions(query: string): Place[] {
  const trimmed = query.trim();
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const { data = [] } = useSearchCitiesQuery(debounced, {
    skip: debounced.length < MIN_QUERY_LENGTH,
  });

  if (trimmed.length < MIN_QUERY_LENGTH) return [];
  return data;
}
