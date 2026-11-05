import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { edgePath, stageStatus } from "../lib/helpers";

type Kind = "ci" | "tf" | "gate" | "k8s";

interface GraphNode {
  id: string;
  label: string;
  kind: Kind;
  col: number;
  row: number;
  log: string;
}

// Coordinates live in a 480x250 viewBox; nodes are positioned in % so the graph scales.
const VW = 480;
const VH = 250;
const W = 72;
const H = 44;
const COL_X = [0, 82, 163, 245, 326, 408];
const ROW_Y = [12, 103, 194];

// Order doubles as the run sequence (a valid topological order of `edges`).
const nodes: GraphNode[] = [
  { id: "push", label: "git push", kind: "ci", col: 0, row: 1, log: "git push origin main: PR #482 merged, workflow triggered" },
  { id: "test", label: "test", kind: "ci", col: 1, row: 0, log: "pytest + lint: 128 passed, coverage 91%" },
  { id: "build", label: "build", kind: "ci", col: 1, row: 1, log: "docker buildx build -t app:3f9c1a2 (cached layers)" },
  { id: "plan", label: "tf plan", kind: "tf", col: 1, row: 2, log: "terraform plan: 3 to add, 0 to change, 0 to destroy" },
  { id: "scan", label: "scan", kind: "ci", col: 2, row: 1, log: "trivy image scan: 0 critical, 0 high vulnerabilities" },
  { id: "approve", label: "approve", kind: "gate", col: 2, row: 2, log: "environment protection: awaiting reviewer approval... approved" },
  { id: "ecr", label: "ecr push", kind: "ci", col: 3, row: 1, log: "docker push ecr/app:3f9c1a2 (immutable tag)" },
  { id: "apply", label: "tf apply", kind: "tf", col: 3, row: 2, log: "terraform apply: 3 added, 0 changed, 0 destroyed" },
  { id: "deploy", label: "deploy", kind: "k8s", col: 4, row: 1, log: "helm upgrade --install --atomic: rolling out 3/3 pods on EKS" },
  { id: "smoke", label: "verify", kind: "k8s", col: 5, row: 0, log: "post-deploy smoke tests passed, health checks green" },
  { id: "observe", label: "observe", kind: "k8s", col: 5, row: 2, log: "observability stack live: metrics, logs, dashboards, alerts" },
];

const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [4, 6],
  [5, 7],
  [6, 8],
  [7, 8],
  [8, 9],
  [8, 10],
];

const pos = (n: GraphNode) => ({ x: COL_X[n.col], y: ROW_Y[n.row] });

export { nodes as pipelineNodes, edges as pipelineEdges };

const kindStyle: Record<Kind, { on: string; glow: string; dot: string; legend: string }> = {
  ci: { on: "border-warn/70 bg-warn/10 text-warn", glow: "shadow-[0_0_18px_-4px_var(--color-warn)]", dot: "bg-warn", legend: "CI/CD" },
  tf: { on: "border-tf/70 bg-tf/10 text-tf", glow: "shadow-[0_0_18px_-4px_var(--color-tf)]", dot: "bg-tf", legend: "Terraform" },
  gate: { on: "border-gate/70 bg-gate/10 text-gate", glow: "shadow-[0_0_18px_-4px_var(--color-gate)]", dot: "bg-gate", legend: "Approval gate" },
  k8s: { on: "border-info/70 bg-info/10 text-info", glow: "shadow-[0_0_18px_-4px_var(--color-info)]", dot: "bg-info", legend: "Kubernetes" },
};

const STEP_MS = 750;
const HOLD_MS = 3600;
const DONE_LOG = "Release 3f9c1a2 is live in prod: 0 errors, auto-rollback armed.";

export function InfraGraph() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? nodes.length : 0);
  const complete = step >= nodes.length;

  useEffect(() => {
    if (reduce) {
      setStep(nodes.length);
      return;
    }
    const t = setTimeout(() => setStep((s) => (s >= nodes.length ? 0 : s + 1)), complete ? HOLD_MS : STEP_MS);
    return () => clearTimeout(t);
  }, [step, complete, reduce]);

  const log = complete ? DONE_LOG : nodes[step].log;

  return (
    <div
      className="panel overflow-hidden rounded-xl"
      role="img"
      aria-label="Animated release pipeline: a git push runs tests, a container build and a Terraform plan; the image is scanned and pushed to ECR while the infrastructure change waits for approval and is applied with Terraform; Helm then deploys atomically to Kubernetes, followed by post-deploy verification and the observability stack."
    >
      <div aria-hidden="true">
        <div className="flex items-center justify-between border-b border-line bg-ink/60 px-4 py-2.5 font-mono text-xs">
          <span className="flex items-center gap-2 text-white/60">
            <span className={`size-2 rounded-full ${complete ? "bg-ok" : "animate-pulse bg-info"}`} />
            release pipeline
            <span className="text-white/30">· {complete ? "released" : "running"}</span>
          </span>
          <span className="text-ok">
            {Math.min(step, nodes.length)}/{nodes.length} stages
          </span>
        </div>

        <div className="p-4">
          <div className="relative w-full" style={{ aspectRatio: `${VW} / ${VH}`, contain: "layout paint" }}>
            <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 size-full">
              {edges.map(([from, to]) => {
                const a = pos(nodes[from]);
                const b = pos(nodes[to]);
                const d = edgePath({ x: a.x + W, y: a.y + H / 2 }, { x: b.x, y: b.y + H / 2 });
                const status = stageStatus(to, step);
                return (
                  <g key={`${from}-${to}`}>
                    <path d={d} fill="none" stroke="var(--color-line)" strokeWidth="2" />
                    {status === "done" && <path d={d} fill="none" stroke="var(--color-ok)" strokeWidth="2" opacity="0.8" />}
                    {status === "running" && (
                      <>
                        <path d={d} fill="none" stroke="var(--color-info)" strokeWidth="2.5" className="edge-flow" />
                        <circle r="3.5" fill="var(--color-info)">
                          <animateMotion dur="0.75s" repeatCount="indefinite" path={d} />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {nodes.map((n, i) => {
              const status = stageStatus(i, step);
              const k = kindStyle[n.kind];
              const { x, y } = pos(n);
              return (
                <div
                  key={n.id}
                  className={`absolute flex flex-col items-center justify-center gap-1 rounded-lg border font-mono text-[9px] font-bold transition-all duration-300 sm:text-[10px] ${
                    status === "idle" ? "border-line bg-ink/60 text-white/30" : `${k.on} ${status === "running" ? `animate-pulse ${k.glow}` : ""}`
                  }`}
                  style={{ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%`, width: `${(W / VW) * 100}%`, height: `${(H / VH) * 100}%` }}
                >
                  {status === "done" && <Check size={10} className="absolute top-0.5 right-0.5 text-ok" />}
                  {n.label}
                  {n.id === "deploy" && status !== "idle" && (
                    <span className="flex gap-1">
                      {[0, 1, 2].map((p) => (
                        <span key={p} className="pod size-1.5 rounded-[2px]" style={{ animationDelay: `${p * 0.25}s` }} />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-gradient-to-r from-warn via-tf to-ok transition-all duration-500" style={{ width: `${(Math.min(step, nodes.length) / nodes.length) * 100}%` }} />
          </div>
          <p className={`mt-3 truncate font-mono text-[12px] ${complete ? "font-bold text-ok" : "text-white/70"}`}>
            <span className="text-white/30">&gt; </span>
            {log}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-white/45">
            {(Object.keys(kindStyle) as Kind[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${kindStyle[k].dot}`} />
                {kindStyle[k].legend}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
