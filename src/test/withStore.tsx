import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { setupStore } from "@/app/store";

export function createStoreWrapper() {
  const store = setupStore();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}
