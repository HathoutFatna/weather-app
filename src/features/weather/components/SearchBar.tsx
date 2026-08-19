import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ onSearch }: { onSearch: (city: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      className="flex gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const city = value.trim();
        if (city) onSearch(city);
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
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-full bg-input py-3 pr-4 pl-11 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
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
