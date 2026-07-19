import { expect, test } from "@playwright/test";

test("objectives list and detail variants", async ({ page }) => {
  await page.goto("/dashboard/objectives");
  await expect(page.getByRole("heading", { name: "Objectives" })).toBeVisible();
  const filterChevrons = page.locator(
    '.objective-tools img[src*="filter-chevron"]',
  );
  await expect(filterChevrons).toHaveCount(2);
  await expect(filterChevrons.first()).toHaveCSS("width", "11px");
  await expect(filterChevrons.first()).toHaveCSS("height", "7px");
  await page.getByRole("button", { name: /Owners:/ }).click();
  await page.getByRole("button", { name: "Priya Wong" }).click();
  await expect(
    page.getByRole("button", { name: /Owners: Priya Wong/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Risk:/ }).click();
  await page.getByRole("button", { name: "At risk" }).click();
  await expect(
    page.getByRole("button", { name: /Risk: At risk/ }),
  ).toBeVisible();
  await page
    .getByText("Boost qualified leads from our website for Q4 sales.")
    .first()
    .click();
  await expect(page.getByText("Objective details")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByLabel("Objective title")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByLabel("Objective title")).toBeHidden();
  await page.getByRole("button", { name: "Monthly" }).click();
  await page.getByRole("button", { name: "Weekly" }).click();
  await expect(page.getByRole("button", { name: "Weekly" })).toBeVisible();
  await page.getByRole("button", { name: "Add risk" }).click();
  await expect(page.getByText("New execution risk")).toBeVisible();
  await page.getByRole("button", { name: "Key Results" }).click();
  await page.getByRole("button", { name: "Add key result" }).click();
  await expect(
    page.getByRole("heading", { name: "Create a new key result" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Updates" }).click();
  await page.getByRole("button", { name: "All updates" }).click();
  await page.getByRole("button", { name: "Key result updates" }).click();
  await page.getByRole("button", { name: "Relationships" }).click();
  await page.getByRole("button", { name: "Add Relationship" }).click();
  await expect(page.locator(".relationship-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Comments" }).click();
  await page.getByRole("button", { name: "Add a comment" }).click();
  await expect(page.getByPlaceholder("Enter a comment")).toBeVisible();
  await page.screenshot({
    path: "test-results/objective-drawer-comments.png",
    fullPage: true,
  });
});

test("objective cards expand from the full disclosure row", async ({
  page,
}) => {
  await page.goto("/dashboard/objectives");
  const card = page.locator(".objective-card").nth(1);
  await card.locator("footer").click();
  await expect(card.locator(".kr-list")).toBeVisible();
});

test("OKR builder, key result variants and progress modal", async ({
  page,
}) => {
  await page.goto("/dashboard/objectives");
  await page.getByRole("button", { name: /New OKR/ }).click();
  const okrHero = page.getByRole("img", { name: "OKR target" });
  await expect(okrHero).toBeVisible();
  await expect(okrHero).toHaveJSProperty("complete", true);
  expect(await okrHero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(
    page.getByRole("heading", { name: "Create new OKR" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Team-wide/ }).click();
  await page.getByLabel("Select team").selectOption("Engineering");
  await page.getByLabel("Select a cycle").selectOption("Q3–Q4 Strategy Cycle");
  await page.getByText("Refine with AI", { exact: true }).click();
  await expect(page.locator('input[value="Increase"]')).toBeVisible();
  await expect(
    page.locator('input[value="qualified website leads by 30%"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: /Add a key result/ }).click();
  await expect(
    page.getByRole("heading", { name: "Create a new key result" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Baseline/ }).click();
  await page.getByRole("button", { name: /Milestone/ }).click();
  await page.getByRole("button", { name: /Get AI Suggestions/ }).click();
  await expect(
    page.getByText("Get 1500+ customer onboard").first(),
  ).toBeVisible();
  const suggestionPlus = page.locator(".ai-suggestions button img").first();
  await expect(suggestionPlus).toHaveCSS("width", "14px");
  await expect(suggestionPlus).toHaveCSS("height", "14px");
  await page.locator(".ai-suggestions button").first().click();
  await expect(page.locator(".ai-suggestions button").first()).toContainText(
    "Added",
  );
});

test("team strategy entry", async ({ page }) => {
  await page.goto("/dashboard/strategy/teams");
  await expect(
    page.getByRole("heading", { name: "Team Strategy & Planning" }),
  ).toBeVisible();
  await expect(page.getByText("Mandate", { exact: true })).toBeVisible();
});
