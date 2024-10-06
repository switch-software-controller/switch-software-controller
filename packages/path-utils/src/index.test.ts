import { describe, expect, it } from "vitest";
import { generateTimestampedFileName, normalizeFileName } from "./index.ts";

describe(generateTimestampedFileName, () => {
  it("should generate a timestamped file name", () => {
    const extension = "png";
    const date = new Date();
    date.setFullYear(2024, 9, 6);
    date.setHours(1, 23, 45, 678);

    const actual = generateTimestampedFileName(extension, date);

    expect(actual).toEqual("2024-10-06_01-23-45-678.png");
  });
});

describe(normalizeFileName, () => {
  it("should generate a timestamped file name when file name is undefined", () => {
    const extension = "png";
    const getCurrentDate = () => {
      const date = new Date();
      date.setFullYear(2024, 9, 6);
      date.setHours(1, 23, 45, 678);
      return date;
    };
    const fileName = undefined;

    const actual = normalizeFileName(extension, getCurrentDate, fileName);

    expect(actual).toEqual("2024-10-06_01-23-45-678.png");
  });

  it("should add extension to end of file name when not yet", () => {
    const extension = "png";
    const getCurrentDate = () => {
      const date = new Date();
      date.setFullYear(2024, 9, 6);
      date.setHours(1, 23, 45, 678);
      return date;
    };
    const fileName = "foo";

    const actual = normalizeFileName(extension, getCurrentDate, fileName);

    expect(actual).toEqual("foo.png");
  });

  it("should not add extension to end of file name when already", () => {
    const extension = "png";
    const getCurrentDate = () => {
      const date = new Date();
      date.setFullYear(2024, 9, 6);
      date.setHours(1, 23, 45, 678);
      return date;
    };
    const fileName = "foo.png";

    const actual = normalizeFileName(extension, getCurrentDate, fileName);

    expect(actual).toEqual("foo.png");
  });
});
