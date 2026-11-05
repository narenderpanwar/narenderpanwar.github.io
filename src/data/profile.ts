// Single source of truth for all portfolio content.
// Values marked TODO are not in the resume and need your input before publishing.

export type Level = 3 | 2 | 1; // 3 = used daily, 2 = used often, 1 = used occasionally

export interface Stage {
  id: string;
  label: string;
  detail: string;
}

export interface Skill {
  name: string;
  level: Level;
}

export type SkillIcon = "cloud" | "containers" | "iac" | "cicd" | "observability" | "systems";

export interface SkillGroup {
  title: string;
  icon: SkillIcon;
  items: Skill[];
}

export interface Project {
  title: string;
  tag: string;
  problem: string;
  action: string;
  results: string[];
  stack: string[];
  accent: "ok" | "info" | "warn" | "tf";
  href?: string;
}

export type CertBrand = "terraform" | "kubernetes" | "aws";

export interface Certification {
  name: string;
  issuer: string;
  level: string;
  date: string;
  href: string;
  brand: CertBrand;
}

export const profile = {
  name: "Narender Panwar",
  handle: "narender",
  role: "DevOps Engineer",
  headline: "DevOps Engineer II · AWS · Terraform · Kubernetes · CI/CD",
  summary:
    "DevOps Engineer II at HashedIn by Deloitte with 4+ years automating multi-cloud infrastructure. I build CI/CD, infrastructure as code, Kubernetes platforms and observability, and I'm a certified Kubernetes Administrator, Terraform Associate and AWS Solutions Architect.",
  location: "Gurugram, India",
  email: "narenderpnwr@gmail.com",
  linkedin: "https://www.linkedin.com/in/narenderpnwr/",
  github: "", // TODO: e.g. "https://github.com/your-handle"; the GitHub icons stay hidden until set
  resume: "", // TODO: e.g. "/resume.pdf" (put the PDF in /public); leave empty to hide Resume buttons
};

// The recruiter "TL;DR" card.
export const availability = {
  status: "Open to work",
  facts: [
    { label: "Current role", value: "DevOps Engineer II, HashedIn by Deloitte" },
    { label: "Experience", value: "4+ years" },
    { label: "Location", value: "Gurugram, India" },
    { label: "Certified", value: "CKA · Terraform Associate · AWS SAA" },
    { label: "Core stack", value: "AWS · Terraform · Kubernetes · Ansible" },
    { label: "Notice period", value: "TODO (e.g. 30 days)" }, // TODO
  ],
};

export const engineerYaml: string[] = [
  "apiVersion: career/v1",
  "kind: Engineer",
  "metadata:",
  "  name: narender-panwar",
  "  labels: { role: devops, status: open-to-work }",
  "spec:",
  "  clouds: [aws, azure, azure-china]",
  "  iac: [terraform, packer]",
  "  config: [ansible]",
  "  containers: [docker, kubernetes, helm]",
  "  cicd: [github-actions, jenkins]",
  "  observability: [prometheus, grafana, efk]",
  "  certs: [cka, terraform-associate, aws-saa]",
  "status:",
  "  phase: Running",
  "  ready: true",
];

export const logLines: { level: "INFO" | "OK" | "WARN"; text: string }[] = [
  { level: "OK", text: "packer build: golden image shared to aws, azure" },
  { level: "INFO", text: "terraform plan: 0 to destroy" },
  { level: "OK", text: "github actions: deploy to lambda succeeded" },
  { level: "INFO", text: "ansible playbook applied: changed=12 failed=0" },
  { level: "WARN", text: "coffee level low, refilling" },
  { level: "OK", text: "security hub: 0 open findings" },
  { level: "INFO", text: "helm upgrade: release deployed to eks" },
  { level: "OK", text: "all health checks green" },
];

export const stages: Stage[] = [
  { id: "commit", label: "Commit", detail: "trunk-based flow, small reviewed PRs" },
  { id: "build", label: "Build", detail: "reproducible, cached container and image builds" },
  { id: "test", label: "Test", detail: "unit, integration and policy checks in parallel" },
  { id: "scan", label: "Scan", detail: "image, dependency and Security Hub compliance gate" },
  { id: "deploy", label: "Deploy", detail: "IaC-driven rollout with automatic rollback" },
  { id: "observe", label: "Observe", detail: "metrics, logs and alerts in Prometheus, Grafana and EFK" },
];

// TODO: set each level to how often you use the tool (3 = daily, 2 = often, 1 = occasionally); it only decides the tier row.
export const skillGroups: SkillGroup[] = [
  {
    title: "Cloud",
    icon: "cloud",
    items: [{ name: "AWS", level: 3 }, { name: "Azure", level: 2 }],
  },
  {
    title: "Containers & Orchestration",
    icon: "containers",
    items: [{ name: "Docker", level: 3 }, { name: "Kubernetes", level: 3 }, { name: "Helm", level: 2 }, { name: "Docker Buildx", level: 2 }],
  },
  {
    title: "Automation & IaC",
    icon: "iac",
    items: [
      { name: "Terraform", level: 3 },
      { name: "Ansible", level: 3 },
      { name: "Packer", level: 3 },
      { name: "Python", level: 2 },
      { name: "Bash", level: 3 },
    ],
  },
  {
    title: "CI/CD & Source Control",
    icon: "cicd",
    items: [
      { name: "GitHub Actions", level: 3 },
      { name: "Jenkins", level: 3 },
      { name: "AWS CodePipeline", level: 2 },
      { name: "Git & GitLab", level: 3 },
    ],
  },
  {
    title: "Observability",
    icon: "observability",
    items: [{ name: "Prometheus", level: 2 }, { name: "Grafana", level: 2 }, { name: "EFK Stack", level: 2 }],
  },
  {
    title: "Systems & Data",
    icon: "systems",
    items: [{ name: "Linux", level: 3 }, { name: "Windows Server", level: 2 }, { name: "MySQL", level: 2 }, { name: "PostgreSQL", level: 2 }],
  },
];

// Self-assessed, and deliberately humble. The tiers rank *how often I use a tool*, not how good I claim to be.
// Level 3 = used daily, 2 = used often, 1 = used occasionally (see `tierMeta` for how each tier is presented).
export const tierMeta: Record<Level, { letter: string; label: string; usage: string; caption: string; tone: "ok" | "warn" | "bad" }> = {
  3: { letter: "MID", label: "Mid, but confident", usage: "Used daily", caption: "Still googling the flags, just much faster than before.", tone: "ok" },
  2: { letter: "NGL", label: "Vibes-based knowledge", usage: "Used often", caption: "Works on my machine. Docs open in 14 tabs.", tone: "warn" },
  1: { letter: "F", label: "Speedrunning the docs", usage: "Used occasionally", caption: "Seen it once. Respect it deeply. Fear it slightly.", tone: "bad" },
};

export const skillsDisclaimer = "4+ years in, 3 certs, and I still open the docs and ask AI. Growth mindset, allegedly.";

// Six projects drawn from the resume. Facts only; no company names are shown on the cards.
export const projects: Project[] = [
  {
    title: "Scalable AWS Platform",
    tag: "Cloud",
    problem: "Product teams needed reliable, scalable infrastructure on AWS across multiple projects.",
    action: "Designed, deployed and managed solutions on EC2, VPC, ELB, Route53, RDS, S3, IAM, SNS, Autoscaling, CloudWatch, Lambda and EKS.",
    results: ["Scalable, well-architected AWS environments", "Cloud cost optimised while keeping performance high", "On-call support for deployments, infrastructure and ad-hoc issues"],
    stack: ["EC2", "VPC", "ELB", "Route53", "RDS", "CloudWatch"],
    accent: "ok",
  },
  {
    title: "Containers on Kubernetes",
    tag: "Kubernetes",
    problem: "Applications needed consistent packaging and dependable orchestration.",
    action: "Containerised applications with Docker and deployed and orchestrated them on Kubernetes using Helm.",
    results: ["Repeatable, versioned releases with Helm", "Consistent environments from dev to prod", "Scalable workloads orchestrated by Kubernetes"],
    stack: ["Docker", "Kubernetes", "Helm"],
    accent: "info",
  },
  {
    title: "CI/CD Pipelines",
    tag: "Delivery",
    problem: "Several projects relied on manual build, test and deployment steps.",
    action: "Designed and managed pipelines on Jenkins and AWS CodePipeline that automate build, test and deployment.",
    results: ["Automated build, test and deploy across projects", "Faster, more consistent releases", "Fewer manual deployment errors"],
    stack: ["Jenkins", "AWS CodePipeline", "Git"],
    accent: "warn",
  },
  {
    title: "Infrastructure as Code & Automation",
    tag: "IaC",
    problem: "Cloud resources and system setup were done by hand, with repetitive tasks prone to human error.",
    action: "Contributed Terraform for automated provisioning and management of cloud resources, and scripted repetitive tasks and configuration in Bash and Python.",
    results: ["Automated, repeatable provisioning", "Less manual effort and fewer human errors", "Consistent configuration across environments"],
    stack: ["Terraform", "Bash", "Python"],
    accent: "tf",
  },
  {
    title: "Observability & Compliance",
    tag: "Reliability",
    problem: "Teams needed visibility into application health and a clean security posture on AWS.",
    action: "Set up Prometheus and Grafana monitoring, application logging with Elasticsearch, Fluentd and Kibana, and resolved all Security Hub findings.",
    results: ["Real-time visibility into health and performance", "All Security Hub findings and vulnerabilities resolved", "Infrastructure meeting compliance standards"],
    stack: ["Prometheus", "Grafana", "EFK", "Security Hub"],
    accent: "ok",
  },
  {
    title: "Chef to Ansible Migration",
    tag: "Config management",
    problem: "Legacy Chef cookbooks caused configuration drift across multi-cloud environments.",
    action: "Migrated legacy Chef cookbooks to Ansible playbooks, improving automation efficiency and reducing configuration drift across multi-cloud environments.",
    results: ["Improved automation efficiency", "Reduced configuration drift across multi-cloud environments", "Modernised configuration management"],
    stack: ["Ansible", "Chef", "Multi-cloud"],
    accent: "warn",
  },
];

export const credentials: { certifications: Certification[] } = {
  certifications: [
    {
      name: "HashiCorp Certified: Terraform Associate",
      issuer: "HashiCorp",
      level: "Associate",
      date: "Aug 2024",
      href: "https://www.credly.com/badges/65ec06b8-9a82-4aa2-a13b-7d6e10c08dec/public_url",
      brand: "terraform",
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "CNCF · Linux Foundation",
      level: "Administrator",
      date: "Jun 2024",
      href: "https://www.credly.com/badges/863b4e86-1fdd-41c4-b69f-e5019eff3d49/public_url",
      brand: "kubernetes",
    },
    {
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      level: "Associate",
      date: "Jul 2023",
      href: "https://www.credly.com/badges/d450021a-b9dc-4851-af5d-27642100d877/public_url",
      brand: "aws",
    },
  ],
};

// TODO: tune to what you actually want.
// Footer lines 2 and 3 (line 1 is the copyright + stack). Keep it short.
export const aiConfessionLines = ["All prompted into existence by AI in a few minutes and took the credit.", "No cap. :D"] as const;

export const lookingFor: string[] = [
  "DevOps, Platform or SRE roles",
  "Cloud automation, IaC and CI/CD challenges",
  "Teams that value reliability, security and cost efficiency",
];

export const rotatingWords: string[] = [
  "CI/CD pipelines",
  "cloud infrastructure",
  "configuration management",
  "containers & orchestration",
];

export const navLinks = [
  { href: "#skills", label: "Skills" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];
