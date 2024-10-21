import { describe, expect, test } from "vitest";
import { StickTiltPresetDefault } from "./stick-tilt.ts";
import { StickTiltPreset } from '@switch-software-controller/controller-api';

describe("StickTiltPresetDefault", () => {
  test.each([
    { direction: "N", tilt: StickTiltPresetDefault[StickTiltPreset.Neutral], x: 128, y: 128 },
    { direction: "R", tilt: StickTiltPresetDefault[StickTiltPreset.Right], x: 255, y: 127 },
    { direction: "TR", tilt: StickTiltPresetDefault[StickTiltPreset.TopRight], x: 218, y: 37 },
    { direction: "T", tilt: StickTiltPresetDefault[StickTiltPreset.Top], x: 128, y: 0 },
    { direction: "TL", tilt: StickTiltPresetDefault[StickTiltPreset.TopLeft], x: 38, y: 37 },
    { direction: "L", tilt: StickTiltPresetDefault[StickTiltPreset.Left], x: 0, y: 127 },
    { direction: "BL", tilt: StickTiltPresetDefault[StickTiltPreset.BottomLeft], x: 38, y: 217 },
    { direction: "B", tilt: StickTiltPresetDefault[StickTiltPreset.Bottom], x: 128, y: 255 },
    { direction: "BR", tilt: StickTiltPresetDefault[StickTiltPreset.BottomRight], x: 218, y: 217 },
  ])(
    "should have preset values $direction: { x: $x, y: $y }",
    ({ tilt, x, y }) => {
      expect(tilt.x).toEqual(x);
      expect(tilt.y).toEqual(y);
    },
  );
});
