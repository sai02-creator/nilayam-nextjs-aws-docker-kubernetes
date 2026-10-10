import { describe, expect, it } from "vitest";
import {
  PROCESSING_FEE_RATE,
  MAX_INFANTS,
  MIN_ADULTS,
} from "@/lib/booking-rules";

describe("booking rules", () => {
  it("uses an 8% processing fee", () => {
    expect(PROCESSING_FEE_RATE).toBe(0.08);
  });

  it("allows a maximum of two infants", () => {
    expect(MAX_INFANTS).toBe(2);
  });

  it("requires at least one adult", () => {
    expect(MIN_ADULTS).toBe(1);
  });
});
