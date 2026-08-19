# Technical decisions

Short notes on choices for this exercise, to explain why the stack looks the way it does.

## 1. OpenWeatherMap API (free tier, current docs)

Three free endpoints, same API key:

- `GET /geo/1.0/direct?q={city}` — Geocoding API, city name → lat/lon
- `GET /data/2.5/weather?lat=&lon=` — current weather
- `GET /data/2.5/forecast?lat=&lon=` — 5-day / 3-hour forecast

The free forecast returns ~40 three-hour slots, so we group by calendar day (using the location's `timezone` offset), take min/max temp, and one condition per day. Simple, testable, and enough for five day cards.

## 2. Custom UI, not a component library

The screen is a dark theme adapted from a community Figma weather design. A library (MUI, shadcn) would mean restyling defaults for a handful of primitives (button, input, card, skeleton, toggle). Plain Tailwind v4 with the palette as CSS tokens, plus lucide-react for icons, is less code and no extra UI dependency.

## 3. RTK Query for server state

Weather and geocoding are server state: loading, errors and cache. RTK Query ships with Redux Toolkit, which we already use for client state.

Weather barely changes in a session, so a result stays **fresh for 30 minutes** (`refetchOnMountOrArgChange`) and **retained for 1 hour** if unused (`keepUnusedDataFor`). That also limits free-tier API use. The cache is not written to `localStorage` — stale weather overnight is worse than one refetch.

API failures stay in the query (`isError` / `refetch`). They are not thrown into the error boundary.

## 4. Redux Toolkit slices for client state

Two slices: **temperature unit** and **recent search history**, persisted to `localStorage`. Shared, user-owned state used by unrelated UI pieces. Weather never enters those slices.

## 5. Units (C/F): fetch once, convert on the client

Request weather in metric once, then convert with pure functions for display. No refetch on toggle — simpler UX and easy unit tests. Tradeoff: conversion is approximate vs asking the API again in imperial; fine for this scope.

## 6. Feature-based folder structure

Code is grouped by feature (`weather`, `preferences`, `search-history`) rather than by type (`components/`, `hooks/` everywhere). Related API, domain, and UI stay together.

## 7. One root error boundary, written as a class

React only catches render crashes via `getDerivedStateFromError` / `componentDidCatch` — there is no hook for that. One class at the root is enough for this app; Suspense is unused: RTK Query already exposes loading as `isLoading`.
