import { render, screen } from "@testing-library/react";
import { VisitorCounter } from "./VisitorCounter";

const respond = (value: unknown) => (globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ value }) }));

describe("VisitorCounter", () => {
  beforeEach(() => localStorage.clear());

  it("shows the total once the counter responds", async () => {
    respond(1234567);
    render(<VisitorCounter />);
    expect(await screen.findByRole("status")).toHaveTextContent("12,34,567 visits and counting");
  });

  it("uses the singular for the very first visit", async () => {
    respond(1);
    render(<VisitorCounter />);
    expect(await screen.findByRole("status")).toHaveTextContent("1 visit and counting");
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
