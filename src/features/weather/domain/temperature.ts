export type TemperatureUnit = "celsius" | "fahrenheit";

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * 1.8 + 32;
}

export function displayTemperature(
  celsius: number,
  unit: TemperatureUnit,
): number {
  const value = unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
  return Math.round(value);
}
