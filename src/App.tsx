import { UnitToggle } from "@/features/preferences/components/UnitToggle";
import { WeatherView } from "@/features/weather/components/WeatherView";

function App() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Weather</h1>
        <UnitToggle />
      </header>
      <WeatherView />
    </div>
  );
}

export default App;
