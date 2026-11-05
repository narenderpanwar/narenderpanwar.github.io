import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { rotatingWords } from "../data/profile";
import { RoleRotator } from "./RoleRotator";

// Cycling logic is under test, not framer's exit animation (which needs real frames).
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    span: ({ children, className }: { children: ReactNode; className?: string }) => <span className={className}>{children}</span>,
  },
}));

afterEach(() => vi.useRealTimers());

describe("RoleRotator", () => {
  it("rotates exactly the four things I automate, in order", () => {
    expect(rotatingWords).toEqual(["CI/CD pipelines", "cloud infrastructure", "configuration management", "containers & orchestration"]);
  });

  it("announces the full list once to screen readers", () => {
    render(<RoleRotator />);
    expect(screen.getByText(`I automate ${rotatingWords.join(", ")}.`)).toBeInTheDocument();
  });

  it("shows the first item, then cycles through all four and wraps", () => {
    vi.useFakeTimers();
    render(<RoleRotator />);
    expect(screen.getByText(rotatingWords[0])).toBeInTheDocument();

    for (let step = 1; step <= rotatingWords.length; step++) {
      act(() => {
        vi.advanceTimersByTime(2200);
      });
      expect(screen.getByText(rotatingWords[step % rotatingWords.length])).toBeInTheDocument();
    }
  });
});
