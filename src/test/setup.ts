import "@testing-library/jest-dom/vitest";

class Stub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.assign(globalThis, { IntersectionObserver: Stub, ResizeObserver: Stub });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.scrollTo = () => {};
// Tests must never reach the network (visitor counter etc.); individual tests override this.
globalThis.fetch = vi.fn().mockRejectedValue(new Error("network disabled in tests"));
// Skip the boot intro in tests; Boot has its own dedicated tests.
sessionStorage.setItem("booted", "1");
