import { describe, expect, it } from "vitest";
import { createDefaultTimer } from "./factory.ts";
import { TimerImpl } from "./timer.ts";

describe(createDefaultTimer, () => {
  it("should returns a Timer instance", () => {
    const timer = createDefaultTimer();
    expect(timer).toBeInstanceOf(TimerImpl);
  });
});
