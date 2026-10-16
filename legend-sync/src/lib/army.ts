/**
 * Decoder for Clash of Clans army share codes (the `army=` value of a CopyArmy link).
 *
 * Sections, each introduced by a letter:
 *   h  heroes. Entries are `heroId`, then `p<petId>` and `e<equipId>_<equipId>`, joined by `-`.
 *   i  Clan Castle troops, as `countxId` entries joined by `-`.
 *   d  Clan Castle spells.
 *   u  troops and siege machines.
 *   s  spells.
 *
 * Example: h0p16e8_14-1p1e17_48u11x59s4x2
 */

export const HERO_NAMES: Record<number, string> = {
  0: "Barbarian King",
  1: "Archer Queen",
  2: "Grand Warden",
  3: "Battle Machine",
  4: "Royal Champion",
  5: "Battle Copter",
  6: "Minion Prince",
  7: "Dragon Duke",
};

export const PET_NAMES: Record<number, string> = {
  0: "L.A.S.S.I",
  1: "Mighty Yak",
  2: "Electro Owl",
  3: "Unicorn",
  4: "Phoenix",
  7: "Poison Lizard",
  8: "Diggy",
  9: "Frosty",
  10: "Spirit Fox",
  11: "Angry Jelly",
  16: "Sneezy",
  17: "Greedy Raven",
};

export const EQUIPMENT_NAMES: Record<number, string> = {
  0: "Barbarian Puppet",
  1: "Rage Vial",
  2: "Archer Puppet",
  3: "Invisibility Vial",
  4: "Eternal Tome",
  5: "Life Gem",
  6: "Seeking Shield",
  7: "Royal Gem",
  8: "Earthquake Boots",
  9: "Hog Rider Puppet",
  10: "Giant Gauntlet",
  11: "Vampstache",
  12: "Haste Vial",
  13: "Rocket Spear",
  14: "Spiky Ball",
  15: "Frozen Arrow",
  16: "Monolith Arrow",
  17: "Giant Arrow",
  19: "Heroic Torch",
  20: "Healer Puppet",
  22: "Fireball",
  24: "Rage Gem",
  32: "Snake Bracelet",
  34: "Healing Tome",
  35: "Dark Crown",
  39: "Magic Mirror",
  40: "Electro Boots",
  41: "Lavaloon Puppet",
  42: "Henchmen Puppet",
  43: "Dark Orb",
  44: "Metal Pants",
  47: "Noble Iron",
  48: "Action Figure",
  49: "Meteor Staff",
  50: "Frost Flake",
  51: "Stick Horse",
  52: "Fire Heart",
  53: "Rocket Backpack",
  56: "Stun Blaster",
  57: "Flame Blower",
  59: "Electro Fangs",
  60: "Revenge Deck",
};

export const SPELL_NAMES: Record<number, string> = {
  0: "Lightning Spell",
  1: "Healing Spell",
  2: "Rage Spell",
  3: "Jump Spell",
  4: "Santa's Surprise",
  5: "Freeze Spell",
  9: "Poison Spell",
  10: "Earthquake Spell",
  11: "Haste Spell",
  16: "Clone Spell",
  17: "Skeleton Spell",
  22: "Birthday Boom",
  28: "Bat Spell",
  35: "Invisibility Spell",
  53: "Recall Spell",
  70: "Overgrowth Spell",
  84: "Yellow Card",
  98: "Revive Spell",
  109: "Ice Block Spell",
  120: "Totem Spell",
  123: "Angry Spell",
};

export const TROOP_NAMES: Record<number, string> = {
  0: "Barbarian",
  1: "Archer",
  2: "Goblin",
  3: "Giant",
  4: "Wall Breaker",
  5: "Balloon",
  6: "Wizard",
  7: "Healer",
  8: "Dragon",
  9: "P.E.K.K.A",
  10: "Minion",
  11: "Hog Rider",
  12: "Valkyrie",
  13: "Golem",
  15: "Witch",
  17: "Lava Hound",
  22: "Bowler",
  23: "Baby Dragon",
  24: "Miner",
  26: "Super Barbarian",
  27: "Super Archer",
  28: "Super Wall Breaker",
  29: "Super Giant",
  30: "Ice Wizard",
  45: "Battle Ram",
  47: "Royal Ghost",
  48: "Pumpkin Barbarian",
  50: "Giant Skeleton",
  53: "Yeti",
  55: "Sneaky Goblin",
  56: "Super Miner",
  57: "Rocket Balloon",
  58: "Ice Golem",
  59: "Electro Dragon",
  60: "Golden Dragon",
  61: "Skeleton Barrel",
  63: "Inferno Dragon",
  64: "Super Valkyrie",
  65: "Dragon Rider",
  66: "Super Witch",
  67: "M.E.C.H.A / El Primo",
  72: "Party Wizard",
  76: "Ice Hound",
  80: "Super Bowler",
  81: "Super Dragon",
  82: "Headhunter",
  83: "Super Wizard",
  84: "Super Minion",
  95: "Electro Titan",
  97: "Apprentice Warden",
  98: "Super Hog",
  109: "Ruin Witch",
  110: "Root Rider",
  119: "Firecracker",
  120: "Azure Dragon",
  121: "Barbarian Kicker",
  122: "Giant Thrower",
  123: "Druid",
  125: "Broom Witch",
  132: "Thrower",
  142: "Snake Barrel",
  147: "Super Yeti",
  150: "Furnace",
  177: "Meteor Golem",
  // Siege machines
  51: "Wall Wrecker",
  52: "Battle Blimp",
  62: "Stone Slammer",
  75: "Siege Barracks",
  87: "Log Launcher",
  91: "Flame Flinger",
  92: "Battle Drill",
  135: "Troop Launcher",
  188: "Sky Wagon",
};

const SIEGE_IDS = new Set([51, 52, 62, 75, 87, 91, 92, 135, 188]);

export type ArmyUnit = {
  id: number;
  count: number;
  name: string;
  kind: "troop" | "siege" | "spell";
};

export type ArmyHero = {
  id: number;
  name: string;
  pet: { id: number; name: string } | null;
  equipment: Array<{ id: number; name: string }>;
};

export type DecodedArmy = {
  heroes: ArmyHero[];
  troops: ArmyUnit[];
  spells: ArmyUnit[];
  castleTroops: ArmyUnit[];
  castleSpells: ArmyUnit[];
};

function troopUnit(id: number, count: number): ArmyUnit {
  return {
    id,
    count,
    name: TROOP_NAMES[id] ?? `Troop ${id}`,
    kind: SIEGE_IDS.has(id) ? "siege" : "troop",
  };
}

function spellUnit(id: number, count: number): ArmyUnit {
  return { id, count, name: SPELL_NAMES[id] ?? `Spell ${id}`, kind: "spell" };
}

function parseUnits(body: string, make: (id: number, count: number) => ArmyUnit): ArmyUnit[] {
  const units: ArmyUnit[] = [];
  for (const entry of body.split("-")) {
    const m = /^(\d+)x(\d+)$/.exec(entry);
    if (m) units.push(make(Number(m[2]), Number(m[1])));
  }
  return units;
}

function parseHeroes(body: string): ArmyHero[] {
  const heroes: ArmyHero[] = [];
  for (const entry of body.split("-")) {
    const head = /^(\d+)/.exec(entry);
    if (!head) continue;
    const id = Number(head[1]);
    let pet: ArmyHero["pet"] = null;
    const equipment: ArmyHero["equipment"] = [];
    for (const part of entry.slice(head[1]!.length).matchAll(/([pe])(\d+(?:_\d+)*)/g)) {
      if (part[1] === "p") {
        const petId = Number(part[2]);
        pet = { id: petId, name: PET_NAMES[petId] ?? `Pet ${petId}` };
      } else {
        for (const raw of part[2]!.split("_")) {
          const equipId = Number(raw);
          equipment.push({ id: equipId, name: EQUIPMENT_NAMES[equipId] ?? `Equipment ${equipId}` });
        }
      }
    }
    heroes.push({ id, name: HERO_NAMES[id] ?? `Hero ${id}`, pet, equipment });
  }
  return heroes;
}

/** Accepts a raw share code or a full CopyArmy link. Returns null when nothing can be decoded. */
export function decodeArmy(input: string | null | undefined): DecodedArmy | null {
  if (!input) return null;
  let raw = input.trim();
  const link = /[?&]army=([^&#]+)/i.exec(raw);
  if (link?.[1]) {
    try {
      raw = decodeURIComponent(link[1]);
    } catch {
      raw = link[1];
    }
  }
  raw = raw.toLowerCase();

  const sections = new Map<string, string>();
  for (const m of raw.matchAll(/([hidus])([^hidus]*)/g)) {
    sections.set(m[1]!, (sections.get(m[1]!) ?? "") + m[2]!);
  }

  const army: DecodedArmy = {
    heroes: parseHeroes(sections.get("h") ?? ""),
    troops: parseUnits(sections.get("u") ?? "", troopUnit),
    spells: parseUnits(sections.get("s") ?? "", spellUnit),
    castleTroops: parseUnits(sections.get("i") ?? "", troopUnit),
    castleSpells: parseUnits(sections.get("d") ?? "", spellUnit),
  };

  const empty =
    army.heroes.length + army.troops.length + army.spells.length + army.castleTroops.length + army.castleSpells.length === 0;
  return empty ? null : army;
}

/** A short readable name built from the biggest troop groups, for armies the API has not named. */
export function autoArmyName(army: DecodedArmy): string {
  const pool = army.troops.filter((t) => t.kind === "troop");
  const source = pool.length > 0 ? pool : army.troops;
  const top = [...source].sort((a, b) => b.count - a.count).slice(0, 2);
  return top.length > 0 ? top.map((t) => t.name).join(" + ") : "Army";
}

/**
 * Canonical identity of an army. Two codes with the same key are the same army with small
 * differences in layout: entry order, equipment order, and where units sit (a siege machine in
 * the Clan Castle versus the army camp, or Clan Castle troops versus the same troops in the camp).
 * Heroes, pets and hero equipment still count, so a different loadout is a different army.
 */
export function armyKey(code: string): string {
  const army = decodeArmy(code);
  if (!army) return code;

  const heroes = [...army.heroes]
    .sort((a, b) => a.id - b.id)
    .map((h) => `${h.id}p${h.pet?.id ?? ""}e${h.equipment.map((e) => e.id).sort((a, b) => a - b).join("_")}`)
    .join("-");

  const merge = (...lists: ArmyUnit[][]): string => {
    const totals = new Map<number, number>();
    for (const list of lists) {
      for (const unit of list) totals.set(unit.id, (totals.get(unit.id) ?? 0) + unit.count);
    }
    return [...totals]
      .sort((a, b) => a[0] - b[0])
      .map(([id, count]) => `${id}x${count}`)
      .join("-");
  };

  return `h${heroes}u${merge(army.troops, army.castleTroops)}s${merge(army.spells, army.castleSpells)}`;
}
