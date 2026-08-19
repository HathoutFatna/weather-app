import { useId, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useCitySuggestions } from "../hooks/useCitySuggestions";
import { formatCityLabel } from "../domain/mapCurrentWeather";
import type { Place } from "../domain/models";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectPlace: (place: Place) => void;
}

export function SearchBar({ onSearch, onSelectPlace }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  // -1 = nothing highlighted: Enter then submits the text itself.
  const [highlighted, setHighlighted] = useState(-1);
  const suggestions = useCitySuggestions(value);
  const listboxId = useId();

  const expanded = open && suggestions.length > 0;

  const choosePlace = (place: Place) => {
    setValue(formatCityLabel(place));
    setOpen(false);
    setHighlighted(-1);
    onSelectPlace(place);
  };

  const submit = () => {
    if (expanded && highlighted >= 0) {
      const selected = suggestions[highlighted];
      if (selected) choosePlace(selected);
      return;
    }
    const city = value.trim();
    if (city) {
      setOpen(false);
      setHighlighted(-1);
      onSearch(city);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.length === 0) return;
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      // Cycle through -1 (nothing highlighted) and every option.
      const states = suggestions.length + 1;
      setHighlighted((prev) => ((prev + 1 + step + states) % states) - 1);
    } else if (event.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  return (
    <form
      role="search"
      className="flex gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <label htmlFor="city-input" className="sr-only">
          City
        </label>
        <input
          id="city-input"
          type="text"
          autoComplete="off"
          placeholder="Search for a city"
          value={value}
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            expanded && highlighted >= 0
              ? `${listboxId}-option-${highlighted}`
              : undefined
          }
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="w-full rounded-full bg-input py-3 pr-4 pl-11 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        {expanded && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="City suggestions"
            className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            {suggestions.map((place, index) => (
              <li key={formatCityLabel(place)}>
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === highlighted}
                  // preventDefault keeps focus in the input, so onBlur
                  // doesn't close the list before this click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choosePlace(place)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors ${
                    index === highlighted ? "bg-secondary" : ""
                  }`}
                >
                  <MapPin
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  {formatCityLabel(place)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring"
      >
        Search
      </button>
    </form>
  );
}
