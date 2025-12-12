const { buildRouter } = require("../src/routes");

test("validateTitle: acepta strings >=2 chars", () => {
  const { validateTitle } = buildRouter();
  expect(validateTitle("ok")).toBe(true);
  expect(validateTitle("a")).toBe(false);
  expect(validateTitle("   ")).toBe(false);
  expect(validateTitle(null)).toBe(false);
});
