export const COUNTER_URL = "https://abacus.jasoncameron.dev";
export const COUNTER_PATH = "narenderpanwar-portfolio/visits";
export const SEEN_KEY = "visit-counted";

interface Deps {
  fetchFn?: typeof fetch;
  storage?: Pick<Storage, "getItem" | "setItem">;
  hostname?: string;
  signal?: AbortSignal;
}

// Local previews must not inflate the public number.
export function isCountableHost(hostname: string): boolean {
  return hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "[::1]" && !hostname.endsWith(".local");
}

function read(storage: Deps["storage"]): boolean {
  try {
    return storage?.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function remember(storage: Deps["storage"]): void {
  try {
    storage?.setItem(SEEN_KEY, "1");
  } catch {
    // private mode: the visitor is simply counted again next time
  }
}

// Counts a browser once (then only reads); resolves null on any failure so the UI can hide itself.
export async function loadVisitorCount({
  fetchFn = fetch,
  storage = typeof localStorage === "undefined" ? undefined : localStorage,
  hostname = typeof location === "undefined" ? "" : location.hostname,
  signal,
}: Deps = {}): Promise<number | null> {
  const counts = isCountableHost(hostname) && !read(storage);
  try {
    const res = await fetchFn(`${COUNTER_URL}/${counts ? "hit" : "get"}/${COUNTER_PATH}`, { signal });
    if (!res.ok) return null;
    const { value } = (await res.json()) as { value?: unknown };
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    if (counts) remember(storage);
    return value;
  } catch {
    return null;
  }
}
