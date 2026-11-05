import { act, fireEvent, render, screen } from "@testing-library/react";
import { Boot, BOOT_KEY } from "./components/Boot";
import { BackToTop } from "./components/BackToTop";
import App from "./App";

afterEach(() => {
  sessionStorage.setItem(BOOT_KEY, "1");
  vi.useRealTimers();
});

describe("Boot", () => {
  it("auto-completes after the last line and records that it ran", () => {
    vi.useFakeTimers();
    sessionStorage.removeItem(BOOT_KEY);
    const onDone = vi.fn();
    render(<Boot onDone={onDone} />);
    for (let i = 0; i < 8; i++) {
      act(() => {
        vi.advanceTimersByTime(500);
      });
    }
    expect(screen.getByText(/Health checks passed/)).toBeInTheDocument();
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(BOOT_KEY)).toBe("1");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("can be skipped with the button, click or keyboard, and only reports once", () => {
    const onDone = vi.fn();
    const { unmount } = render(<Boot onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.click(screen.getByRole("status"));
    expect(onDone).toHaveBeenCalledTimes(1);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("ignores unrelated keys", () => {
    const onDone = vi.fn();
    render(<Boot onDone={onDone} />);
    fireEvent.keyDown(window, { key: "a" });
    expect(onDone).not.toHaveBeenCalled();
  });
});

describe("App boot intro", () => {
  it("shows on the first visit and is dismissible", () => {
    sessionStorage.removeItem(BOOT_KEY);
    render(<App />);
    expect(screen.getByRole("status", { name: "Loading portfolio" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));
    expect(sessionStorage.getItem(BOOT_KEY)).toBe("1");
  });

  it("is skipped for reduced-motion users", () => {
    sessionStorage.removeItem(BOOT_KEY);
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q.includes("reduce") })) as typeof window.matchMedia;
    render(<App />);
    expect(screen.queryByRole("status", { name: "Loading portfolio" })).not.toBeInTheDocument();
    window.matchMedia = original;
  });

  it("is not shown again within the same session", () => {
    render(<App />);
    expect(screen.queryByRole("status", { name: "Loading portfolio" })).not.toBeInTheDocument();
  });
});

describe("BackToTop", () => {
  it("appears after scrolling and scrolls to the top when clicked", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<BackToTop />);
    expect(screen.queryByRole("button", { name: "Back to top" })).not.toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { value: 900, configurable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });
});
