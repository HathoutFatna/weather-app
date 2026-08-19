import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { setupStore } from "@/app/store";
import { UnitToggle } from "./UnitToggle";

describe("UnitToggle", () => {
  it("toggles the store from Celsius to Fahrenheit", async () => {
    const user = userEvent.setup();
    const store = setupStore();

    render(
      <Provider store={store}>
        <UnitToggle />
      </Provider>,
    );

    const button = screen.getByRole("button", {
      name: /fahrenheit/i,
    });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(store.getState().preferences.unit).toBe("celsius");

    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(store.getState().preferences.unit).toBe("fahrenheit");
  });
});
