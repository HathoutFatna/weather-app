import { History } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { formatCityLabel } from "@/features/weather/domain/mapCurrentWeather";
import type { Place } from "@/features/weather/domain/models";
import { selectRecentPlaces } from "../searchHistorySlice";

export function RecentSearches({
  onSelect,
}: {
  onSelect: (place: Place) => void;
}) {
  const places = useAppSelector(selectRecentPlaces);
  if (places.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <History aria-hidden="true" className="size-3.5" />
        Recent
      </span>
      <ul aria-label="Recent searches" className="flex flex-wrap gap-2">
        {places.map((place) => (
          <li key={`${place.lat},${place.lon}`}>
            <button
              type="button"
              onClick={() => onSelect(place)}
              className="rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground transition-colors outline-none hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              {formatCityLabel(place)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
