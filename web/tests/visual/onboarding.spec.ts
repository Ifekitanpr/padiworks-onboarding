import { test, expect } from "@playwright/test";

for (const route of ["goals", "company", "context", "objective", "invite"]) {
  test(`${route} onboarding visual`, async ({ page }) => {
    await page.goto(`/onboarding/${route}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
    await page.screenshot({ path: `test-results/${route}.png`, fullPage: true });
  });
}

test("invite populated state", async ({ page }) => {
  await page.goto("/onboarding/invite");
  await page.getByPlaceholder("john@company.com").fill("patrickadanini@gmail.com");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("patrickadanini@gmail.com")).toBeVisible();
  await page.screenshot({ path: "test-results/invite-populated.png", fullPage: true });
});

test("onboarding hands off to dashboard", async ({ page }) => {
  await page.goto("/onboarding/invite");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/strategy$/);
  await expect(page.getByRole("heading", { name: "Organization Strategy & Planning" })).toBeVisible();
});

test("demo workspace setup completes and opens the dashboard", async ({ page }) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: /Try Demo/ }).click();
  await expect(page.getByRole("dialog", { name: /Setting up your demo workspace/ })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/strategy$/, { timeout: 5000 });
  await expect(page.getByRole("heading", { name: "Organization Strategy & Planning" })).toBeVisible();
});

test("objective suggestion populates its answer", async ({ page }) => {
  await page.goto("/onboarding/objective");
  const suggestion = "Double enterprise ARR while keeping gross margin ≥ 70%";
  await page.getByRole("button", { name: suggestion }).click();
  await expect(page.locator(".objective-fields textarea").first()).toHaveValue(suggestion);
});

test("goal selection variants", async ({ page }) => {
  await page.goto("/onboarding/goals");
  await page.evaluate(() => document.fonts.ready);
  const cards = page.locator(".goal-card");
  for (let index = 0; index < 4; index += 1) {
    await cards.nth(index).click();
    await expect(cards.nth(index)).toHaveAttribute("aria-pressed", "true");
    await page.screenshot({ path: `test-results/goals-selected-${index + 1}.png`, fullPage: true });
  }
});
