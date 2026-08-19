export interface WeatherConditionDto {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherDto {
  name: string;
  weather: WeatherConditionDto[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

export interface ForecastSlotDto {
  dt: number;
  main: {
    temp: number;
  };
  weather: WeatherConditionDto[];
}

export interface ForecastResponseDto {
  list: ForecastSlotDto[];
  city: {
    name: string;
    timezone: number;
  };
}
