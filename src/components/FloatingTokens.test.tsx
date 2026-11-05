import { render } from "@testing-library/react";
import { FloatingTokens } from "./FloatingTokens";

describe("FloatingTokens", () => {
  it("is purely decorative: hidden from assistive tech and not clickable", () => {
    const { container } = render(<FloatingTokens />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("pointer-events-none");
  });

  it("floats the original DevOps glyphs", () => {
    const { container } = render(<FloatingTokens />);
    const texts = [...container.querySelectorAll("span.animate-float")].map((e) => e.textContent);
    expect(texts).toEqual(["{ }", "</>", "⎈", "yaml", "IaC", "k8s"]);
  });

  it("has no logos, stickers or memes in it", () => {
    const { container } = render(<FloatingTokens />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("[data-logo]")).toBeNull();
    expect(container.textContent).not.toMatch(/aura farming|locked in|LGTM|cooked/i);
  });
});
