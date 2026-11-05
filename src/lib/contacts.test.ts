import { getContacts, handleFromUrl } from "./contacts";

const base = {
  email: "a@b.co",
  linkedin: "https://www.linkedin.com/in/narenderpnwr/",
  github: "https://github.com/someone",
};

describe("handleFromUrl", () => {
  it("returns the last path segment, ignoring trailing slashes", () => {
    expect(handleFromUrl("https://www.linkedin.com/in/narenderpnwr/")).toBe("narenderpnwr");
    expect(handleFromUrl("https://github.com/someone")).toBe("someone");
  });

  it("falls back to the input when it is not a URL, and handles a bare host", () => {
    expect(handleFromUrl("not a url")).toBe("not a url");
    expect(handleFromUrl("https://example.com")).toBe("https://example.com");
  });
});

describe("getContacts", () => {
  it("offers LinkedIn, GitHub, email and copy-email, with no phone, WhatsApp or contact-card channels", () => {
    const ids = getContacts(base).map((c) => c.id);
    expect(ids).toEqual(["linkedin", "github", "email", "copy"]);
    for (const gone of ["call", "whatsapp", "vcard"]) expect(ids).not.toContain(gone);
  });

  it("gives each channel the right kind and target", () => {
    const byId = Object.fromEntries(getContacts(base).map((c) => [c.id, c]));
    expect(byId.linkedin).toMatchObject({ value: "narenderpnwr", kind: "link", external: true });
    expect(byId.email).toMatchObject({ href: "mailto:a@b.co", kind: "link" });
    expect(byId.copy).toMatchObject({ kind: "copy", value: "a@b.co" });
  });

  it("drops link channels that have no URL, e.g. GitHub before it is set, but keeps copy-email", () => {
    const ids = getContacts({ ...base, github: "" }).map((c) => c.id);
    expect(ids).not.toContain("github");
    expect(ids).toEqual(expect.arrayContaining(["linkedin", "copy"]));
  });
});
