// @vitest-environment jsdom
import { describe, expect, test } from "vite-plus/test";
import { setupCounter } from "./counter.ts";

describe("setupCounter", () => {
  test("initializes button text to 'Count is 0'", () => {
    const button = document.createElement("button");
    setupCounter(button);
    expect(button.innerHTML).toBe("Count is 0");
  });

  test("increments count on click", () => {
    const button = document.createElement("button");
    setupCounter(button);
    button.click();
    expect(button.innerHTML).toBe("Count is 1");
  });

  test("increments count multiple times", () => {
    const button = document.createElement("button");
    setupCounter(button);
    button.click();
    button.click();
    button.click();
    expect(button.innerHTML).toBe("Count is 3");
  });

  test("each button has independent state", () => {
    const a = document.createElement("button");
    const b = document.createElement("button");
    setupCounter(a);
    setupCounter(b);
    a.click();
    a.click();
    b.click();
    expect(a.innerHTML).toBe("Count is 2");
    expect(b.innerHTML).toBe("Count is 1");
  });
});
