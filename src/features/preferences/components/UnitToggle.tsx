import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUnit, unitToggled } from "../preferencesSlice";

export function UnitToggle() {
  const unit = useAppSelector(selectUnit);
  const dispatch = useAppDispatch();
  const isFahrenheit = unit === "fahrenheit";

  return (
    <button
      type="button"
      aria-pressed={isFahrenheit}
      aria-label="Show temperatures in Fahrenheit"
      onClick={() => dispatch(unitToggled())}
      className="flex rounded-full bg-input p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Segment active={!isFahrenheit}>°C</Segment>
      <Segment active={isFahrenheit}>°F</Segment>
    </button>
  );
}

function Segment({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}
