import { copy, designer, driveFolderUrl, projectFilters, projects, services, socialLinks, studioPrinciples } from "../data/site";

export const defaultSiteContent = {
  copy,
  designer,
  driveFolderUrl,
  projectFilters,
  projects,
  services,
  socialLinks,
  studioPrinciples
};

export type SiteContent = typeof defaultSiteContent;

const CONTENT_PATH = "data/site-content.json";
const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  const owner = process.env.GITHUB_CONTENT_OWNER;
  const repo = process.env.GITHUB_CONTENT_REPO;
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch: process.env.GITHUB_CONTENT_BRANCH || "main" };
}

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<SiteContent>;
  return Boolean(
    content.copy && typeof content.copy === "object" &&
    content.designer && typeof content.designer === "object" &&
    typeof content.driveFolderUrl === "string" &&
    Array.isArray(content.projectFilters) &&
    Array.isArray(content.projects) &&
    Array.isArray(content.services) &&
    Array.isArray(content.socialLinks) &&
    Array.isArray(content.studioPrinciples)
  );
}

function githubHeaders(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  const config = githubConfig();
  if (config) {
    const url = `${GITHUB_API}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(config.branch)}`;
    const response = await fetch(url, { headers: githubHeaders(config.token), cache: "no-store" });
    if (response.status === 404) return defaultSiteContent;
    if (!response.ok) throw new Error("تعذر قراءة محتوى الموقع من GitHub.");
    const file = await response.json() as { content?: string; encoding?: string };
    if (!file.content || file.encoding !== "base64") throw new Error("ملف محتوى الموقع على GitHub غير صالح.");
    const content: unknown = JSON.parse(Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"));
    if (!isSiteContent(content)) throw new Error("تنسيق محتوى الموقع غير صالح.");
    return content;
  }

  if (process.env.NODE_ENV !== "production") {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    try {
      const content: unknown = JSON.parse(await readFile(join(process.cwd(), CONTENT_PATH), "utf8"));
      if (isSiteContent(content)) return content;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return defaultSiteContent;
}

export async function writeSiteContent(content: unknown) {
  if (!isSiteContent(content)) throw new Error("بيانات المحتوى غير مكتملة أو غير صالحة.");
  const serialized = `${JSON.stringify(content, null, 2)}\n`;
  if (Buffer.byteLength(serialized, "utf8") > 1_500_000) throw new Error("حجم المحتوى أكبر من الحد المسموح.");

  const config = githubConfig();
  if (config) {
    const url = `${GITHUB_API}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${CONTENT_PATH}`;
    const current = await fetch(`${url}?ref=${encodeURIComponent(config.branch)}`, {
      headers: githubHeaders(config.token), cache: "no-store"
    });
    let sha: string | undefined;
    if (current.ok) sha = (await current.json() as { sha: string }).sha;
    else if (current.status !== 404) throw new Error("تعذر التحقق من نسخة المحتوى الحالية على GitHub.");
    const response = await fetch(url, {
      method: "PUT",
      headers: { ...githubHeaders(config.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Update portfolio content from owner studio",
        content: Buffer.from(serialized, "utf8").toString("base64"),
        branch: config.branch,
        ...(sha ? { sha } : {})
      })
    });
    if (!response.ok) throw new Error("فشل حفظ التعديلات على GitHub. راجع صلاحية رمز الوصول واسم المستودع والفرع.");
    return { savedTo: "github" as const };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("الحفظ الدائم غير مهيأ. أضف إعدادات GITHUB_CONTENT_* إلى بيئة الاستضافة.");
  }
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const filePath = join(process.cwd(), CONTENT_PATH);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, serialized, "utf8");
  return { savedTo: "local" as const };
}

export function contentStorageReady() {
  return process.env.NODE_ENV !== "production" || Boolean(githubConfig());
}
