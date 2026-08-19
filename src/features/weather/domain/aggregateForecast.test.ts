import { describe, expect, it } from "vitest";
import type { ForecastResponseDto, ForecastSlotDto } from "../api/dto";
import { aggregateForecast } from "./aggregateForecast";

// All test times are relative to 2026-01-01 00:00 UTC.
const T0 = Date.UTC(2026, 0, 1) / 1000;
const hours = (h: number) => T0 + h * 3600;

function slot(
  dt: number,
  temp: number,
  main = "Clouds",
  icon = "04d",
): ForecastSlotDto {
  return {
    dt,
    main: { temp },
    weather: [{ id: 800, main, description: main.toLowerCase(), icon }],
  };
}

function response(list: ForecastSlotDto[], timezone = 0): ForecastResponseDto {
  return { list, city: { name: "Test City", timezone } };
}

describe("aggregateForecast", () => {
  it("groups slots by day with min and max temperature", () => {
    const days = aggregateForecast(
      response([
        slot(hours(0), 10),
        slot(hours(3), 4),
        slot(hours(6), 12),
        slot(hours(24), 8),
        slot(hours(27), 15),
      ]),
    );

    expect(days).toHaveLength(2);
    expect(days[0]).toMatchObject({
      date: "2026-01-01",
      minTempC: 4,
      maxTempC: 12,
    });
    expect(days[1]).toMatchObject({
      date: "2026-01-02",
      minTempC: 8,
      maxTempC: 15,
    });
  });
});
