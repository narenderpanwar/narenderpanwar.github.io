import { render, screen } from "@testing-library/react";
import { VisitorCounter } from "./VisitorCounter";

const respond = (value: unknown) => (globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ value }) }));

describe("VisitorCounter", () => {
  beforeEach(() => localStorage.clear());

  it("shows the total once the counter responds", async () => {
    respond(1234567);
    render(<VisitorCounter />);
    expect(await screen.findByRole("status")).toHaveAccessibleName("12,34,567 visits");
  });

  it("uses the singular for the very first visit", async () => {
    respond(1);
    render(<VisitorCounter />);
    expect(await screen.findByRole("status")).toHaveAccessibleName("1 visit");
  });

  it("floats in the bottom-right corner without blocking clicks", async () => {
    respond(10);
    render(<VisitorCounter />);
    const pill = await screen.findByRole("status");
    expect(pill).toHaveClass("fixed", "right-5", "bottom-5", "pointer-events-none");
    expect(pill).toHaveTextContent("10");
    expect(pill).toHaveTextContent("visits · live");
  });

  it("renders nothing when the counter is unreachable", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const { container } = render(<VisitorCounter />);
    await vi.waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("does not update after unmount", async () => {
    respond(5);
    const { unmount } = render(<VisitorCounter />);
    unmount();
    await Promise.resolve();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
