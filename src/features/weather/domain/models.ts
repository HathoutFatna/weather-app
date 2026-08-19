export interface Place {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  city: string;
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  description: string;
  icon: string;
  humidityPct: number;
  windSpeedMps: number;
}

export interface DailyForecast {
  date: string;
  minTempC: number;
  maxTempC: number;
  condition: string;
  icon: string;
}
