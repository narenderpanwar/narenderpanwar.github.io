import { act, render, screen } from "@testing-library/react";
import { InfraGraph, pipelineEdges, pipelineNodes } from "./InfraGraph";

const N = pipelineNodes.length;
const idx = (id: string) => pipelineNodes.findIndex((n) => n.id === id);
const sources = (id: string) => pipelineEdges.filter(([, to]) => to === idx(id)).map(([from]) => pipelineNodes[from].id);

const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

afterEach(() => vi.useRealTimers());

describe("pipeline definition (production-grade flow)", () => {
  it("runs in a valid dependency order: every edge goes forward in the sequence", () => {
    for (const [from, to] of pipelineEdges) expect(from).toBeLessThan(to);
  });

  it("starts from a single trigger and every other stage has an upstream", () => {
    const roots = pipelineNodes.filter((_, i) => !pipelineEdges.some(([, to]) => to === i));
    expect(roots.map((r) => r.id)).toEqual(["push"]);
  });

  it("gates the image on tests and the build before it is scanned and pushed", () => {
    expect(sources("scan").sort()).toEqual(["build", "test"]);
    expect(sources("ecr")).toEqual(["scan"]);
  });

  it("requires approval before terraform apply, after a plan", () => {
    expect(sources("approve")).toEqual(["plan"]);
    expect(sources("apply")).toEqual(["approve"]);
  });

  it("only deploys once both the image is pushed and the infrastructure is applied", () => {
    expect(sources("deploy").sort()).toEqual(["apply", "ecr"]);
  });

  it("verifies and observes after the deploy", () => {
    expect(sources("smoke")).toEqual(["deploy"]);
    expect(sources("observe")).toEqual(["deploy"]);
  });

  it("places every stage in its own grid cell", () => {
    const cells = pipelineNodes.map((n) => `${n.col}:${n.row}`);
    expect(new Set(cells).size).toBe(N);
  });
});

describe("InfraGraph", () => {
  it("exposes an accessible description of the pipeline", () => {
    render(<InfraGraph />);
    expect(screen.getByRole("img", { name: /git push runs tests, a container build and a Terraform plan/i })).toBeInTheDocument();
  });

  it("starts at the trigger and advances stage by stage", () => {
    vi.useFakeTimers();
    render(<InfraGraph />);
    expect(screen.getByText(`0/${N} stages`)).toBeInTheDocument();
    expect(screen.getByText(pipelineNodes[0].log)).toBeInTheDocument();

    tick(750);
    expect(screen.getByText(`1/${N} stages`)).toBeInTheDocument();
    expect(screen.getByText(pipelineNodes[1].log)).toBeInTheDocument();
  });

  it("completes with a release message, holds, then loops", () => {
    vi.useFakeTimers();
    render(<InfraGraph />);
    for (let i = 0; i < N; i++) tick(750);
    expect(screen.getByText(/Release 3f9c1a2 is live in prod/)).toBeInTheDocument();
    expect(screen.getByText(`${N}/${N} stages`)).toBeInTheDocument();
    expect(screen.getByText(/· released/)).toBeInTheDocument();

    tick(3600);
    expect(screen.getByText(`0/${N} stages`)).toBeInTheDocument();
    expect(screen.getByText(/· running/)).toBeInTheDocument();
  });
});
