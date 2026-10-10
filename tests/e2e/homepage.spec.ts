import { expect, test } from "@playwright/test";

test("homepage displays the main heading and stay categories", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find the right place to stay" })
  ).toBeVisible();

  await expect(
    page.getByText("Beachfront", { exact: true }).first()
  ).toBeVisible();

  await expect(
    page.getByText("Scenic views", { exact: true }).first()
  ).toBeVisible();
});
