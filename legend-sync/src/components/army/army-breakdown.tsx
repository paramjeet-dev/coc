import { decodeArmy, type ArmyHero, type ArmyUnit } from "@/lib/army";
import { equipmentIcon, heroIcon, petIcon, spellIcon, troopIcon } from "@/lib/assets";
import { ArmyIcon } from "./army-icon";

function unitIcon(unit: ArmyUnit): string {
  return unit.kind === "spell" ? spellIcon(unit.name) : troopIcon(unit.name);
}

function UnitList({ units }: { units: ArmyUnit[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {units.map((unit, i) => (
        <li
          key={`${unit.kind}-${unit.id}-${i}`}
          className="flex items-center gap-2 rounded-lg bg-ink-850 py-1 pl-1 pr-2.5 text-sm ring-1 ring-ink-800"
        >
          <ArmyIcon src={unitIcon(unit)} name={unit.name} size={28} />
          <span className="font-mono text-xs font-semibold tabular-nums text-gold-300">{unit.count}x</span>
          <span className="text-ink-100">{unit.name}</span>
        </li>
      ))}
    </ul>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-500">{children}</h4>
  );
}

function HeroRow({ hero }: { hero: ArmyHero }) {
  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-2 py-2.5">
      <span className="flex min-w-[10.5rem] items-center gap-2.5">
        <ArmyIcon src={heroIcon(hero.name)} name={hero.name} size={36} />
        <span className="text-sm font-semibold">{hero.name}</span>
      </span>
      {hero.pet && (
        <span className="flex items-center gap-1.5 text-xs text-ink-300">
          <ArmyIcon src={petIcon(hero.pet.name)} name={hero.pet.name} size={24} />
          {hero.pet.name}
        </span>
      )}
      {hero.equipment.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {hero.equipment.map((item, i) => (
            <li
              key={`${item.id}-${i}`}
              className="flex items-center gap-1.5 rounded-md bg-ink-850 py-0.5 pl-0.5 pr-2 text-xs text-ink-300 ring-1 ring-ink-800"
            >
              <ArmyIcon src={equipmentIcon(item.name)} name={item.name} size={22} />
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** The full decoded army: heroes with pets and gear, troops, siege, spells and Clan Castle. */
export function ArmyBreakdown({ code, className = "" }: { code: string; className?: string }) {
  const army = decodeArmy(code);
  if (!army) {
    return <p className={`text-sm text-ink-300 ${className}`}>This army code could not be decoded.</p>;
  }

  const troops = army.troops.filter((u) => u.kind === "troop");
  const siege = army.troops.filter((u) => u.kind === "siege");
  const castle = [...army.castleTroops, ...army.castleSpells];

  return (
    <div className={`space-y-5 ${className}`}>
      {army.heroes.length > 0 && (
        <section aria-label="Heroes">
          <Heading>Heroes</Heading>
          <ul className="divide-y divide-ink-800">
            {army.heroes.map((hero, i) => (
              <HeroRow key={`${hero.id}-${i}`} hero={hero} />
            ))}
          </ul>
        </section>
      )}

      {(troops.length > 0 || siege.length > 0 || army.spells.length > 0) && (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {(troops.length > 0 || siege.length > 0) && (
            <section aria-label="Troops" className="space-y-4">
              {troops.length > 0 && (
                <div>
                  <Heading>Troops</Heading>
                  <UnitList units={troops} />
                </div>
              )}
              {siege.length > 0 && (
                <div>
                  <Heading>Siege machine</Heading>
                  <UnitList units={siege} />
                </div>
              )}
            </section>
          )}
          {army.spells.length > 0 && (
            <section aria-label="Spells">
              <Heading>Spells</Heading>
              <UnitList units={army.spells} />
            </section>
          )}
        </div>
      )}

      {castle.length > 0 && (
        <section aria-label="Clan Castle">
          <Heading>Clan Castle</Heading>
          <UnitList units={castle} />
        </section>
      )}
    </div>
  );
}

/** A one line icon strip of the army, with counts. Good for lists. Excludes the Clan Castle. */
export function ArmyGlyphs({ code, className = "" }: { code: string; className?: string }) {
  const army = decodeArmy(code);
  if (!army) return null;

  const units = [...army.troops, ...army.spells];
  return (
    <ul className={`flex flex-wrap items-center gap-1 ${className}`} aria-label="Army composition">
      {army.heroes.map((hero, i) => (
        <li key={`h-${hero.id}-${i}`} title={hero.name} className="rounded-md ring-1 ring-gold-600/60">
          <ArmyIcon src={heroIcon(hero.name)} name={hero.name} size={26} />
          <span className="sr-only">{hero.name}</span>
        </li>
      ))}
      {army.heroes.length > 0 && units.length > 0 && <li aria-hidden className="mx-0.5 h-5 w-px bg-ink-700" />}
      {units.map((unit, i) => (
        <li key={`${unit.kind}-${unit.id}-${i}`} title={`${unit.count}x ${unit.name}`} className="relative">
          <ArmyIcon src={unitIcon(unit)} name={unit.name} size={26} />
          <span
            aria-hidden
            className="absolute -bottom-1 -right-1 rounded bg-ink-950/90 px-0.5 font-mono text-[0.6rem] font-semibold leading-none tabular-nums text-gold-300"
          >
            {unit.count}
          </span>
          <span className="sr-only">{`${unit.count}x ${unit.name}`}</span>
        </li>
      ))}
    </ul>
  );
}

/** Collapsible breakdown that needs no client JavaScript. */
export function ArmyDetails({ code, preview = true, className = "" }: { code: string; preview?: boolean; className?: string }) {
  if (!decodeArmy(code)) return null;
  return (
    <details className={`group ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold-400 [&::-webkit-details-marker]:hidden">
        {preview ? <ArmyGlyphs code={code} className="min-w-0" /> : null}
        <span className="shrink-0 text-xs text-tide-400 group-hover:underline">
          <span className="group-open:hidden">Full army</span>
          <span className="hidden group-open:inline">Hide army</span>
        </span>
      </summary>
      <ArmyBreakdown code={code} className="mt-3 rounded-xl bg-ink-900 p-4 ring-1 ring-ink-800" />
    </details>
  );
}
