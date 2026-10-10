import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prisma: {
    listing: {
      create: vi.fn(),
      updateMany: vi.fn(),
    },
  },
  requireUser: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

vi.mock("@/lib/auth", () => ({
  requireUser: mocks.requireUser,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createListing, updateListing } from "@/app/actions";

function validListingForm() {
  const form = new FormData();

  form.set("title", "Coastal Sydney Apartment");
  form.set("description", "A comfortable apartment near the beach.");
  form.set("imageSrc", "https://example.com/main.jpg");
  form.set(
    "imageGallery",
    JSON.stringify(["https://example.com/main.jpg"]),
  );
  form.set("category", "Beach");
  form.set("roomCount", "2");
  form.set("bathroomCount", "1");
  form.set("guestCount", "4");
  form.set("locationValue", "Sydney");
  form.set("pricePerNight", "150");

  return form;
}

describe("listing server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.requireUser.mockResolvedValue({
      id: "host-123",
    });

    mocks.prisma.listing.create.mockResolvedValue({
      id: "listing-123",
    });

    mocks.prisma.listing.updateMany.mockResolvedValue({
      count: 1,
    });
  });

  it("rejects invalid listing data", async () => {
    const form = validListingForm();
    form.set("title", "Bad");

    await expect(createListing(form)).rejects.toThrow(
      "Invalid listing payload.",
    );

    expect(mocks.prisma.listing.create).not.toHaveBeenCalled();
  });

  it("creates a listing for the authenticated host", async () => {
    await createListing(validListingForm());

    expect(mocks.prisma.listing.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Coastal Sydney Apartment",
        userId: "host-123",
        pricePerNight: 150,
      }),
    });
  });

  it("scopes listing updates to the authenticated owner", async () => {
    await expect(
      updateListing("listing-456", validListingForm()),
    ).rejects.toThrow("REDIRECT:/host");

    expect(mocks.prisma.listing.updateMany).toHaveBeenCalledWith({
      where: {
        id: "listing-456",
        userId: "host-123",
      },
      data: expect.objectContaining({
        title: "Coastal Sydney Apartment",
      }),
    });
  });
});
