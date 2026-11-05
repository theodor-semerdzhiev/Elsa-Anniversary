export function assetUrl(
  path: string,
  base = import.meta.env.BASE_URL,
  kind: "image" | "file" = "image",
): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  const relative =
    kind === "image" && !clean.startsWith("images/")
      ? `images/${clean}`
      : clean;
  return `${base.replace(/\/?$/, "/")}${relative}`;
}
