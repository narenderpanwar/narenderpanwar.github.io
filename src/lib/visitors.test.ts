import { COUNTER_PATH, COUNTER_URL, SEEN_KEY, isCountableHost, loadVisitorCount } from "./visitors";

const memory = (initial: Record<string, string> = {}) => {
  const data = { ...initial };
  return { getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v), data };
};
const ok = (value: unknown) => vi.fn().mockResolvedValue({ ok: true, json: async () => ({ value }) });

describe("isCountableHost", () => {
  it("ignores local previews", () => {
    for (const h of ["localhost", "127.0.0.1", "[::1]", "laptop.local"]) expect(isCountableHost(h)).toBe(false);
  });

  it("counts the real site", () => {
    expect(isCountableHost("narenderpanwar.github.io")).toBe(true);
  });
});

describe("loadVisitorCount", () => {
  const host = "narenderpanwar.github.io";

  it("hits the counter for a first-time visitor and remembers them", async () => {
    const fetchFn = ok(42);
    const storage = memory();
    expect(await loadVisitorCount({ fetchFn, storage, hostname: host })).toBe(42);
    expect(fetchFn).toHaveBeenCalledWith(`${COUNTER_URL}/hit/${COUNTER_PATH}`, { signal: undefined });
    expect(storage.data[SEEN_KEY]).toBe("1");
  });

  it("only reads the counter for a returning visitor", async () => {
    const fetchFn = ok(42);
    expect(await loadVisitorCount({ fetchFn, storage: memory({ [SEEN_KEY]: "1" }), hostname: host })).toBe(42);
    expect(fetchFn.mock.calls[0][0]).toBe(`${COUNTER_URL}/get/${COUNTER_PATH}`);
  });

  it("counts a browser only once across repeated loads", async () => {
    const fetchFn = ok(7);
    const storage = memory();
    await loadVisitorCount({ fetchFn, storage, hostname: host });
    await loadVisitorCount({ fetchFn, storage, hostname: host });
    expect(fetchFn.mock.calls.map((c) => String(c[0]).split("/")[3])).toEqual(["hit", "get"]);
  });

  it("never counts local previews", async () => {
    const fetchFn = ok(5);
    const storage = memory();
    await loadVisitorCount({ fetchFn, storage, hostname: "localhost" });
    expect(fetchFn.mock.calls[0][0]).toContain("/get/");
    expect(storage.data[SEEN_KEY]).toBeUndefined();
  });

  it("does not mark the visitor as counted when the request fails", async () => {
    const storage = memory();
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    expect(await loadVisitorCount({ fetchFn, storage, hostname: host })).toBeNull();
    expect(storage.data[SEEN_KEY]).toBeUndefined();
  });

  it("returns null on network errors and malformed payloads", async () => {
    expect(await loadVisitorCount({ fetchFn: vi.fn().mockRejectedValue(new Error("offline")), storage: memory(), hostname: host })).toBeNull();
    expect(await loadVisitorCount({ fetchFn: ok("many"), storage: memory(), hostname: host })).toBeNull();
    expect(await loadVisitorCount({ fetchFn: ok(undefined), storage: memory(), hostname: host })).toBeNull();
  });

  it("still works when storage is blocked", async () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(await loadVisitorCount({ fetchFn: ok(9), storage, hostname: host })).toBe(9);
  });
});
