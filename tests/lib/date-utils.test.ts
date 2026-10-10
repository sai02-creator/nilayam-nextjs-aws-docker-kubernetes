import { describe, expect, it } from "vitest";
import { toValidDate } from "@/lib/date-utils";

describe("toValidDate", () => {
  it("returns a Date for a valid ISO date", () => {
    const result = toValidDate("2026-10-11T10:00:00.000Z");

    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe("2026-10-11T10:00:00.000Z");
  });

  it("returns undefined when the value is missing", () => {
    expect(toValidDate()).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(toValidDate("")).toBeUndefined();
  });

  it("returns undefined for an invalid date string", () => {
    expect(toValidDate("not-a-date")).toBeUndefined();
  });
});
