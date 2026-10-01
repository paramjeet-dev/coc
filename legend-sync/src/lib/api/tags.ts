/** Clash tags use the alphabet 0289PYLQGRJCUV. Players often type the letter O for zero. */
const TAG_BODY = /^[0289PYLQGRJCUV]{4,12}$/;

export function normalizeTag(input: string): string {
  const body = input.trim().toUpperCase().replace(/^#/, "").replace(/O/g, "0");
  return `#${body}`;
}

/** URL slug for our own routes: the tag without the leading hash. */
export function tagToSlug(tag: string): string {
  return normalizeTag(tag).slice(1);
}

/** API path segment for a tag. The hash must be percent-encoded. */
export function tagToApi(tag: string): string {
  return encodeURIComponent(normalizeTag(tag));
}

export function isValidTag(input: string): boolean {
  return TAG_BODY.test(normalizeTag(input).slice(1));
}

/** Names made only of tag letters exist, so a bare string needs 6+ chars to count as a tag. */
export function looksLikeTag(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.startsWith("#")) return isValidTag(trimmed);
  return trimmed.length >= 6 && isValidTag(trimmed);
}
