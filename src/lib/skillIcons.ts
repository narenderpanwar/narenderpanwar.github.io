import {
  siAnsible,
  siDocker,
  siElastic,
  siGit,
  siGithubactions,
  siGitlab,
  siGnubash,
  siGrafana,
  siHelm,
  siJenkins,
  siKubernetes,
  siLinux,
  siMysql,
  siPacker,
  siPostgresql,
  siPrometheus,
  siPython,
  siTerraform,
} from "simple-icons";

export interface SkillIconDef {
  path: string;
  hex: string;
}

const from = (i: { path: string; hex: string }): SkillIconDef => ({ path: i.path, hex: `#${i.hex}` });

// Real brand glyphs where simple-icons has them. Skills not listed here (AWS, Azure, Windows Server, ...)
// get a generic fallback icon in the UI because those brands are no longer in the set.
export const skillIcons: Record<string, SkillIconDef> = {
  Docker: from(siDocker),
  "Docker Buildx": from(siDocker),
  Kubernetes: from(siKubernetes),
  Helm: from(siHelm),
  Terraform: from(siTerraform),
  Ansible: from(siAnsible),
  Packer: from(siPacker),
  Python: from(siPython),
  Bash: from(siGnubash),
  "GitHub Actions": from(siGithubactions),
  Jenkins: from(siJenkins),
  "Git & GitLab": from(siGitlab),
  Git: from(siGit),
  Prometheus: from(siPrometheus),
  Grafana: from(siGrafana),
  "EFK Stack": from(siElastic),
  Linux: from(siLinux),
  MySQL: from(siMysql),
  PostgreSQL: from(siPostgresql),
};

// Accent for the fallback icon of skills without a brand glyph.
export const fallbackColor: Record<string, string> = {
  AWS: "#ff9830",
  "AWS CodePipeline": "#ff9830",
  Azure: "#3b9cff",
  "Windows Server": "#5ec8ff",
};
export const DEFAULT_FALLBACK_COLOR = "#8aa0b4";
