import { expect, test } from "@playwright/test";

const routes = [
  ["entry", "/dashboard/strategy"],
  ["priorities", "/dashboard/strategy/priorities"],
  ["priorities-empty", "/dashboard/strategy/priorities/empty"],
  ["knowledge", "/dashboard/strategy/knowledge-base"],
  ["setup", "/dashboard/strategy/setup"],
] as const;

for (const [name, route] of routes) {
  test(`${name} dashboard state`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1088 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { name: "Organization Strategy & Planning" }),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/dashboard-${name}.png`,
      fullPage: true,
    });
  });
}

test("priority planner states and dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1088 });
  await page.goto("/dashboard/strategy/priorities");
  await page.getByRole("button", { name: "In 3 years" }).click();
  await page.getByRole("button", { name: "In 5 years" }).click();
  await expect(page.getByRole("button", { name: "In 5 years" })).toBeVisible();
  await page.locator(".kebab").first().click();
  await expect(page.getByRole("button", { name: "Rename" })).toBeVisible();
  await page.locator(".kebab").first().click();
  await page.locator(".priority-target").first().click();
  await expect(page.locator(".objective-tree")).toBeVisible();
  await page.locator(".objective-tree article > button").first().click();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.locator(".objective-tree article").first()).toContainText(
    "Completed",
  );
  await page.locator(".objective-tree article").first().click();
  await expect(page.locator(".objective-drawer")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Reorder plan" }).click();
  await expect(
    page.getByRole("heading", { name: "Edit priority weights" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: /Add strategic priority/ }).click();
  await expect(
    page.getByRole("heading", { name: "Add strategic priority" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add priority" }).click();
  await page.getByRole("button", { name: /Timeline/ }).click();
  await expect(
    page.getByRole("heading", { name: "Execution timeline" }),
  ).toBeVisible();
});

test("strategy priority card, add objective and progress workflows", async ({
  page,
}) => {
  await page.goto("/dashboard/strategy/priorities");
  await page.locator(".priority-row").first().click();
  await expect(page.locator(".objective-tree")).toBeVisible();
  await page.locator(".priority-row").nth(1).click();
  await expect(page.locator(".objective-tree")).toHaveCount(2);
  await expect(page.locator(".objective-tree").nth(1)).toContainText(
    "Modernise the core platform for reliable scale",
  );
  await page.locator(".small-plus").first().click();
  await expect(
    page.getByRole("heading", { name: "Create new OKR" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.locator(".objective-tree article").first().click();
  await page.getByRole("button", { name: "Update Progress" }).click();
  await expect(
    page.getByRole("heading", { name: "Update Key Result Progress" }),
  ).toBeVisible();
});

test("teams switch enters setup before mandate workspace", async ({ page }) => {
  await page.goto("/dashboard/strategy/priorities");
  await page
    .locator(".scope-switch")
    .getByRole("button", { name: "Teams" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Use padiAI to quickly draft your team's strategy.",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Setup Manually" }).click();
  await expect(
    page.getByRole("button", { name: "Mandate", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "OMTM" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Capabilities" }),
  ).toBeVisible();
  await expect(page.getByPlaceholder("Enter team mandate")).toBeVisible();
  await expect(page.getByPlaceholder("Enter team mandate")).toHaveValue("");
});

test("AI strategy setup completes with generated content", async ({ page }) => {
  await page.goto("/dashboard/strategy");
  await page.getByRole("button", { name: /Proceed with AI/ }).click();
  await expect(page.getByText("Setting up your strategy...")).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/strategy\/setup$/, { timeout: 5000 });
  await expect(page.getByRole("heading", { name: "Strategy setup" })).toBeVisible();
  await expect(page.getByText(/In a world where dreams intertwine/).first()).toBeVisible();
});

test("knowledge base variants", async ({ page }) => {
  await page.goto("/dashboard/strategy/knowledge-base");
  await page.getByRole("button", { name: /Add new link/ }).click();
  await expect(
    page.getByPlaceholder("E.g. Strategic planning documentation"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add link to knowledge base" })
    .click();
  await expect(page.locator('input[value="acme-corp.com"]')).toBeVisible();
  await page.getByRole("button", { name: /Documents/ }).click();
  await expect(page.getByText(/Upload strategy/)).toBeVisible();
  await page.getByRole("button", { name: /Additional Context/ }).click();
  await expect(
    page.getByRole("button", { name: "Save changes" }),
  ).toBeVisible();
});

test("strategy setup variants", async ({ page }) => {
  await page.goto("/dashboard/strategy/setup");
  await page.locator(".setup-fields button").first().click();
  await expect(
    page.getByPlaceholder("Enter vision statement").first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Direction" }).click();
  await expect(page.getByText("Guardrail metrics")).toBeVisible();
  await page.getByRole("button", { name: "Execution" }).click();
  await expect(page.locator(".setup-fields label").first()).toContainText(
    "Business model",
  );
});
