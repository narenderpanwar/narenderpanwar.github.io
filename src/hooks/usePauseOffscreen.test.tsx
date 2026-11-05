import { render } from "@testing-library/react";
import { usePauseOffscreen } from "./usePauseOffscreen";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

function Probe() {
  usePauseOffscreen();
  return (
    <>
      <section data-testid="a" data-anim />
      <section data-testid="b" data-anim />
      <section data-testid="c" />
    </>
  );
}

describe("usePauseOffscreen", () => {
  const original = globalThis.IntersectionObserver;
  let callback: Callback;
  const observed: Element[] = [];
  const disconnect = vi.fn();

  beforeEach(() => {
    observed.length = 0;
    disconnect.mockClear();
    class FakeIO {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect = disconnect;
    }
    globalThis.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = original;
  });

  it("observes only [data-anim] elements and toggles is-offscreen with visibility", () => {
    const { getByTestId } = render(<Probe />);
    expect(observed).toHaveLength(2);

    callback([{ target: getByTestId("a"), isIntersecting: false }]);
    expect(getByTestId("a")).toHaveClass("is-offscreen");

    callback([{ target: getByTestId("a"), isIntersecting: true }]);
    expect(getByTestId("a")).not.toHaveClass("is-offscreen");
    expect(getByTestId("c")).not.toHaveClass("is-offscreen");
  });

  it("stops observing on unmount", () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
