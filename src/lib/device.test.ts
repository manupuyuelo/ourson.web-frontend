import { afterEach, describe, expect, it, vi } from "vitest";
import { detectDevice } from "./device";

function simule(userAgent: string, maxTouchPoints = 0) {
  vi.stubGlobal("navigator", { userAgent, maxTouchPoints });
}

describe("detectDevice", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ["iPhone", "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15", 5, "ios"],
    [
      "iPad qui se présente comme un Mac",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
      5,
      "ios",
    ],
    ["Android", "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Mobile", 5, "android"],
    ["Mac de bureau", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", 0, "desktop"],
    ["Windows", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", 0, "desktop"],
  ] as const)("%s → %s", (_, ua, touch, attendu) => {
    simule(ua, touch);
    expect(detectDevice()).toBe(attendu);
  });
});
