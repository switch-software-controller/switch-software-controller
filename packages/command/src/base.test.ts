import { describe, expect, it } from "vitest";
import { checkCancelled } from "./base.ts";

describe(checkCancelled, () => {
  class Example {
    constructor(readonly isCancelled: boolean) {}

    @checkCancelled()
    target() {
      // Nothing to do here.
    }
  }

  it("should throw CommandCancelledError if cancelled", () => {
    const example = new Example(true);
    expect(() => example.target()).toThrowError(/has been cancelled/);
  });

  it("should not throw CommandCancelledError if not cancelled", () => {
    const example = new Example(false);
    expect(() => example.target()).not.toThrowError();
  });
});
