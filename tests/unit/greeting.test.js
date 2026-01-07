const { getGreeting } = require("../../src/greeting");

describe("getGreeting", () => {
  it("returns the hello world message", () => {
    expect(getGreeting()).toBe("Hello world!");
  });

  it("returns the hello world message with a name", () => {
    expect(getGreeting("Alice")).toBe("Hello world! From Alice");
  });
});
