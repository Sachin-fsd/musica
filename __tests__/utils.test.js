import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "py-1", "px-4")).toBe("py-1 px-4");
  });

  it("skips falsy values", () => {
    expect(cn("text-sm", false && "hidden", null, undefined)).toBe("text-sm");
  });
});
