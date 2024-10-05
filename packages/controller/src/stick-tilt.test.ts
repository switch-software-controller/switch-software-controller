import { describe, expect, test } from "vitest";
import { StickTiltPreset } from "./stick-tilt.ts";

describe("StickTiltPreset", () => {
  test.each([
    { direction: "N", tilt: StickTiltPreset.Neutral, x: 128, y: 128 },
    { direction: "R", tilt: StickTiltPreset.Right, x: 255, y: 127 },
    { direction: "TR", tilt: StickTiltPreset.TopRight, x: 218, y: 37 },
    { direction: "T", tilt: StickTiltPreset.Top, x: 128, y: 0 },
    { direction: "TL", tilt: StickTiltPreset.TopLeft, x: 38, y: 37 },
    { direction: "L", tilt: StickTiltPreset.Left, x: 0, y: 127 },
    { direction: "BL", tilt: StickTiltPreset.BottomLeft, x: 38, y: 217 },
    { direction: "B", tilt: StickTiltPreset.Bottom, x: 128, y: 255 },
    { direction: "BR", tilt: StickTiltPreset.BottomRight, x: 218, y: 217 },
  ])(
    "should have preset values $direction: { x: $x, y: $y }",
    ({ tilt, x, y }) => {
      expect(tilt.x).toEqual(x);
      expect(tilt.y).toEqual(y);
    },
  );
});
