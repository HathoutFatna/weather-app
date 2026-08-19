# Weather Forecast App

Technical exercise: a small weather app that shows **current conditions** and a **5-day forecast** for a city the user searches.

## Problem

Given a city name, the app should:

1. Fetch and display current weather for that city
2. Show a simple five-day forecast
3. Handle invalid input and API failures gracefully
4. Stay modular and readable

**Bonus goals** (we're aiming for these): unit tests, a polished web UI, and a Celsius / Fahrenheit toggle.

Source brief: [`weather_forecast.md`](./weather_forecast.md).

## Planned approach

| Area         | Choice                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------- |
| UI           | React 19 + TypeScript + Vite                                                                    |
| Components   | Custom UI, Tailwind + lucide-react                                                              |
| Weather API  | OpenWeatherMap free: geocoding → current + 5-day/3-hour forecast (group slots into 5 day cards) |
| Server state | RTK Query                                                                                       |
| Client state | Redux Toolkit — unit preference + recent searches only                                          |
| Tests        | Vitest + React Testing Library                                                                  |
| Deploy       | Vercel (planned)                                                                                |

## Status

Documentation and decisions first. Scaffolding and implementation follow on `main`.
