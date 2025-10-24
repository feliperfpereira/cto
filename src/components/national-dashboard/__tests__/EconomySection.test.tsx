import { render, screen } from "@testing-library/react";

import { EconomySection } from "../EconomySection";
import { NATIONS } from "@/data";
import { computeNationMetrics } from "@/lib/nation-utils";

describe("EconomySection", () => {
  it("captures economic metric values in a snapshot", () => {
    const nation = NATIONS[0];
    const metrics = computeNationMetrics(nation);

    render(<EconomySection economy={nation.economy} metrics={metrics} lastUpdated={nation.lastUpdated} />);

    const values = screen
      .getAllByRole("definition")
      .map((definition) => definition.textContent?.replace(/\s+/g, " ").trim());

    expect(values).toMatchInlineSnapshot(`
      [
        "$27.4T",
        "$80,471",
        "2.5%",
        "3.4%",
        "3.7%",
        "123.0%",
      ]
    `);
  });
});
