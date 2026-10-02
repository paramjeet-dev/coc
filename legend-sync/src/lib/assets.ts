import { toNum, type Num } from "./api/types";

export const ASSET_BASE = "https://assets.clashk.ing";

export function assetUrl(path: string): string {
  return `${ASSET_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** "Legend League 2" becomes "legend_league_2", matching the manifest file names. */
export function assetSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function townHallIcon(level: Num | null | undefined): string | null {
  const n = toNum(level);
  return n && n >= 1 && n <= 18 ? assetUrl(`buildings/home-village/town_hall/level_${n}.webp`) : null;
}

export function leagueTierIcon(name: string | null | undefined): string {
  return assetUrl(`leagues/league-tier/${name ? assetSlug(name) : "legend_league"}.png`);
}

export const heroIcon = (name: string) => assetUrl(`heroes/${assetSlug(name)}/icon.webp`);
export const petIcon = (name: string) => assetUrl(`pets/${assetSlug(name)}/icon.webp`);
export const troopIcon = (name: string) => assetUrl(`troops/${assetSlug(name)}/icon.webp`);
export const spellIcon = (name: string) => assetUrl(`spells/${assetSlug(name)}.webp`);
export const equipmentIcon = (name: string) => assetUrl(`equipment/${assetSlug(name)}.webp`);

export const legendLandscape = () => assetUrl("landscape/legend-landscape.png");
