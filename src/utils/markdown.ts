export interface ArticleMeta {
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  readTime: string;
  slug: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string | string[]> = {};
  match[1].split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();
    if (rawValue.startsWith("[")) {
      try {
        data[key] = JSON.parse(rawValue);
      } catch {
        data[key] = rawValue;
      }
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  });

  return { data, content: match[2] };
}

const modules = import.meta.glob("/src/content/articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export function getAllArticles(): ArticleMeta[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split("/").pop()!.replace(".md", "");
      const { data } = parseFrontmatter(raw);
      return {
        slug,
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        description: String(data.description ?? ""),
        category: String(data.category ?? "General"),
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: String(data.readTime ?? "5 min read"),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const entry = Object.entries(modules).find(
    ([path]) => path.split("/").pop()!.replace(".md", "") === slug
  );
  if (!entry) return null;
  const [path, raw] = entry;
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: path.split("/").pop()!.replace(".md", ""),
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    category: String(data.category ?? "General"),
    tags: Array.isArray(data.tags) ? data.tags : [],
    readTime: String(data.readTime ?? "5 min read"),
    content,
  };
}
