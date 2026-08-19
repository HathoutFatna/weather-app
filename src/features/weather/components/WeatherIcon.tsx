import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
  Tornado,
  Wind,
  type LucideIcon,
} from "lucide-react";

// OWM condition groups (https://openweathermap.org/weather-conditions).
// The atmosphere group (Mist, Haze, …) all collapse to fog — the visual
// distinction doesn't matter at this size.
const iconByCondition: Record<string, LucideIcon> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: CloudSnow,
  Squall: Wind,
  Tornado: Tornado,
  Mist: CloudFog,
  Smoke: CloudFog,
  Haze: CloudFog,
  Dust: CloudFog,
  Fog: CloudFog,
  Sand: CloudFog,
  Ash: CloudFog,
};

interface WeatherIconProps {
  condition: string;
  /** OWM icon code — only the day/night suffix is used (e.g. "01n"). */
  icon: string;
  className?: string;
}

export function WeatherIcon({ condition, icon, className }: WeatherIconProps) {
  const isNight = icon.endsWith("n");
  const Icon =
    condition === "Clear" && isNight
      ? Moon
      : (iconByCondition[condition] ?? Cloud);
  return <Icon aria-hidden="true" className={className} />;
}
