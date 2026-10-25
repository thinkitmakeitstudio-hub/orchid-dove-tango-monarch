import { useState } from "react";
import { CARDS, CLASSES, RELICS, RELIC_SLOTS, SUPPLIES, SUPPLY_COST, TREASURE_DECKS, computeStats, deckFor, relicCost, relicEffects, relicIdsOf, xpThreshold, LEVEL_CAP } from "@/game/content";
import { useGame } from "@/game/store";
import { ClassMark } from "./cards";

export function Rules() {
  const openRules = useGame((s) => s.openRules);
  const resetGuild = useGame((s) => s.resetGuild);
  const [ask, setAsk] = useState(false);

  return (
    <div className="overlay" role="presentation" onClick={() => openRules(false)}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="kicker">Rules</p>
        <h2 id="rules-title">How a delve works</h2>
        <h3>The goal</h3>
        <p>Break three seals by defeating mini-bosses, then survive the Hollow King. Wipe, and the delve ends. Levels stay.</p>
        <h3>Doors</h3>
        <p>
          Each depth offers doors. Risk, foe count, and loot odds are true. The flavor is only a rumor. Bigger parties
          face more foes, more health, and harder hits.
        </p>
        <h3>Prep</h3>
        <ul>
          <li>Brace once: gain Block equal to your Defense.</li>
          <li>Spend at most one supply. The pouch holds five.</li>
          <li>Then begin the clash.</li>
        </ul>
        <h3>Battle</h3>
        <ul>
          <li>Heroes act in seat order. Each plays one card from three drawn.</li>
          <li>Damage is Attack + the card, then minus Armor (at least 1 if you connect).</li>
          <li>Incoming hits subtract Defense, then Block. Block clears after the monsters act.</li>
          <li>Poison ticks at the start of the monster phase for foes, and after their strikes for heroes. It then drops by 1.</li>
          <li>At half a form, a boss rages — harder hits, sometimes the whole party.</li>
          <li>
            Seal bosses have three forms. Drop one to zero and it returns at full health, meaner. The Hollow King does
            this once.
          </li>
          <li>
            Quiet halls, nests, and vaults pay common or rare relics only. Mythic loot waits on elites, cursed
            reliquaries, and bosses.
          </li>
          <li>Clearing a fight pays gold. Weak foes pay least, bosses pay most.</li>
          <li>A wayside stall sells supplies and relics for that gold. Every stall stocks a Revive Phial: in prep, use it on a downed ally and they stand with 12 health. Stalls are common, and sometimes a second one sets up as an extra door. The pouch still holds five.</li>
          <li>
            Mages, druids, witches, the necromancer, and the Nephilim have a mana bar. Some cards spend it. Mana does not come back
            on its own — buy a Mana Phial, step into a Ley Font, or wear a relic that drinks from a strike or a shield.
          </li>
          <li>
            Mana Fang returns 3 mana when an attack lands. Bulwark Bead returns 3 mana when you gain Block. Ley Covenant
            still returns 1, and adds Unpriced Word: once each room, the next spell costs nothing.
          </li>
          <li>
            Bleed deals its stacks when the monsters begin to act, then halves. Poison fades by 1 instead. Sawtooth and
            Gut Hook open bleeds. Leech Blade bleeds and heals.
          </li>
          <li>
            Grudge Plate stores damage you weather, block included, up to 12. Grudge Blow then spends it: a heavy hit
            that ignores armor, and a heal.
          </li>
          <li>
            Some relics belong to one class. While worn, they add a card to that hero's deck. Take the relic off and
            the card leaves with it.
          </li>
          <li>The necromancer raises thralls. They strike when called and sometimes step in front of a blow. Two may stand at once.</li>
        </ul>
        <h3>Treasure</h3>
        <p>
          Claim one relic and equip it. Three slots, and a keepsake counts. If you win, bind one relic from the delve to
          its owner. Everything else stays in the dark.
        </p>
        <h3>Unlocks</h3>
        <ul>
          <li>Veil Rogue — clear an Ambush Stair.</li>
          <li>Cinder Witch — survive a Cursed Reliquary.</li>
          <li>Grave Cleric — step into a Ley Font.</li>
          <li>Storm Warden — slay the Grim Warden.</li>
          <li>The Nephilim is already in the guild.</li>
        </ul>
        <div className="inline-actions">
          <button type="button" className="btn btn-gold" onClick={() => openRules(false)}>
            Back to the table
          </button>
          {ask ? (
            <button type="button" className="btn btn-blood" onClick={resetGuild}>
              Confirm disband
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setAsk(true)}>
              Disband guild
            </button>
          )}
        </div>
        <p className="hint">Disband resets levels, keepsakes, and unlocks on this device.</p>
      </div>
    </div>
  );
}

export function HeroSheet() {
  const id = useGame((s) => s.sheet);
  const roster = useGame((s) => s.roster);
  const openSheet = useGame((s) => s.openSheet);
  if (!id) return null;
  const hero = roster.find((h) => h.id === id);
  const cls = CLASSES[id];
  if (!hero || !cls) return null;
  const built = computeStats(id, hero.unlocked ? hero.level : 1, relicIdsOf(hero.keepsakeId, []));
  const cards = deckFor(id, hero.unlocked ? hero.level : 1);
  const unique = [...new Set(cards)];
  const need = xpThreshold(hero.level);

  return (
    <div className="overlay" role="presentation" onClick={() => openSheet(null)}>
      <div className={`sheet class-${id}`} role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className="plate-top">
          <div>
            <p className="kicker">{cls.role}</p>
            <h2 id="sheet-title">{hero.name}</h2>
            <p>{cls.name}</p>
          </div>
          <ClassMark classId={id} />
        </div>
        <p>{cls.blurb}</p>
        <div className="stats-row">
          <span className="stat">HP {built.maxHp}</span>
          <span className="stat">ATK {built.atk}</span>
          <span className="stat">DEF {built.def}</span>
          {hero.unlocked ? <span className="stat">Lv {hero.level}</span> : <span className="stat">Locked</span>}
        </div>
        {hero.unlocked ? (
          <p className="hint">{hero.level >= LEVEL_CAP ? "Max level" : `${hero.xp} / ${need} xp to next level`}</p>
        ) : (
          <p className="lock-line">{cls.unlock?.label}</p>
        )}
        {hero.keepsakeId && RELICS[hero.keepsakeId] ? (
          <p className="hint">Keepsake: {RELICS[hero.keepsakeId].name} — {RELICS[hero.keepsakeId].text}</p>
        ) : null}
        <h3>Deck</h3>
        <ul>
          {unique.map((cid) => {
            const card = CARDS[cid];
            const n = cards.filter((c) => c === cid).length;
            return (
              <li key={cid}>
                <strong>{card?.name}</strong>
                {n > 1 ? ` ×${n}` : ""} — {card?.text}
              </li>
            );
          })}
        </ul>
        <h3>Learned later</h3>
        <ul>
          {cls.milestones.map((m) => (
            <li key={m.cardId}>
              Level {m.level}: {CARDS[m.cardId]?.name}
              {hero.unlocked && hero.level >= m.level ? " (known)" : ""} — {CARDS[m.cardId]?.text}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-gold" onClick={() => openSheet(null)}>
          Close
        </button>
      </div>
    </div>
  );
}

export function GearBook({ onClose }: { onClose: () => void }) {
  const run = useGame((s) => s.run);
  const roster = useGame((s) => s.roster);
  const partyIds = useGame((s) => s.partyIds);
  const heroes = run
    ? run.party.map((h) => ({
        id: h.id,
        name: h.name,
        classId: h.classId,
        level: h.level,
        keepsakeId: h.keepsakeId,
        equipped: run.equipped[h.id] ?? [],
      }))
    : partyIds
        .map((id) => roster.find((h) => h.id === id))
        .filter((h): h is NonNullable<typeof h> => Boolean(h))
        .map((h) => ({
          id: h.id,
          name: h.name,
          classId: h.classId,
          level: h.level,
          keepsakeId: h.keepsakeId,
          equipped: [] as string[],
        }));
  const [tab, setTab] = useState(heroes[0]?.id ?? "");
  const hero = heroes.find((h) => h.id === tab) ?? heroes[0];

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gear-title"
        data-testid="gear-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="kicker">Equipment</p>
        <h2 id="gear-title">What you are wearing</h2>
        <p>
          {run
            ? "Keepsakes came from a won delve. The other slots are relics from this one. Three pieces total."
            : "Only keepsakes survive a delve. Seat a hero, then open Gear inside a run to see relics as you claim them."}
        </p>
        {heroes.length === 0 || !hero ? (
          <p className="hint">Seat a hero to see their belt.</p>
        ) : (
          <>
            <div className="gear-tabs" role="tablist" aria-label="Heroes">
              {heroes.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  role="tab"
                  aria-selected={h.id === hero.id}
                  className={`${h.id === hero.id ? "is-on" : ""} class-${h.classId}`}
                  onClick={() => setTab(h.id)}
                >
                  {h.name}
                </button>
              ))}
            </div>
            <HeroGear hero={hero} inRun={Boolean(run)} />
          </>
        )}
        <button type="button" className="btn btn-gold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function HeroGear({
  hero,
  inRun,
}: {
  hero: { id: string; name: string; classId: string; level: number; keepsakeId: string | null; equipped: string[] };
  inRun: boolean;
}) {
  const cls = CLASSES[hero.classId];
  const worn = relicIdsOf(hero.keepsakeId, hero.equipped);
  const withGear = computeStats(hero.classId, hero.level, worn);
  const bare = computeStats(hero.classId, hero.level, []);
  const slots: { label: string; id: string | null }[] = [
    { label: "Keepsake", id: hero.keepsakeId },
    ...hero.equipped.map((id, i) => ({ label: `Delve relic ${i + 1}`, id })),
  ];
  const delveCap = RELIC_SLOTS - (hero.keepsakeId ? 1 : 0);
  const empty = Math.max(0, delveCap - hero.equipped.length);
  const dh = withGear.maxHp - bare.maxHp;
  const da = withGear.atk - bare.atk;
  const dd = withGear.def - bare.def;

  return (
    <div>
      <p className="hint">{cls?.name}</p>
      <div className="stats-row">
        <span className="stat">HP {withGear.maxHp}</span>
        <span className="stat">ATK {withGear.atk}</span>
        <span className="stat">DEF {withGear.def}</span>
      </div>
      <p className="hint">
        {dh || da || dd
          ? `Gear is worth ${signed(dh)} HP, ${signed(da)} ATK, ${signed(dd)} DEF, before any other tricks below.`
          : "Nothing equipped is changing these numbers yet."}
      </p>
      {slots.map((slot) => (
        <GearSlot key={slot.label} label={slot.label} relicId={slot.id} />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <GearSlot key={`empty-${i}`} label={inRun ? "Empty slot" : "Delve slot"} relicId={null} />
      ))}
    </div>
  );
}

function GearSlot({ label, relicId }: { label: string; relicId: string | null }) {
  const relic = relicId ? RELICS[relicId] : undefined;
  if (!relic) {
    return (
      <article className="gear-slot is-empty">
        <p className="kicker">{label}</p>
        <p className="name font-display">Empty</p>
        <p className="hint">
          {label === "Keepsake"
            ? "Win a delve and bind one relic. It comes home on this hero and uses one of the three slots."
            : "Clear a hall and claim a relic. Bosses expect you to have some."}
        </p>
      </article>
    );
  }
  const bits = relicEffects(relic);
  return (
    <article className={`gear-slot relic-${relic.rarity}`}>
      <p className="kicker">
        {label} · {relic.rarity}
      </p>
      <h3 className="name font-display">{relic.name}</h3>
      <p>{relic.text}</p>
      {bits.length ? (
        <div className="badge-row">
          {bits.map((bit) => (
            <span key={bit} className="badge">
              {bit}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function signed(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}

export function ItemCodex({ onClose }: { onClose: () => void }) {
  const supplies = Object.values(SUPPLIES);
  const groups = (["common", "rare", "mythic"] as const).map((rarity) => ({
    rarity,
    relics: [...new Set(TREASURE_DECKS[rarity])].map((id) => RELICS[id]).filter((relic) => Boolean(relic)),
  }));

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="items-title"
        data-testid="items-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="kicker">Codex</p>
        <h2 id="items-title">Every item</h2>
        <p>Supplies sit in the pouch. Relics are worn, three to a hero. The gold is what a stall charges.</p>
        <h3>Supplies</h3>
        {supplies.map((item) => (
          <article key={item.id} className="codex-row">
            <img className="codex-art" src={`/supplies/${item.id}.png`} alt="" />
            <div>
              <p className="kicker">{SUPPLY_COST[item.id]} gold</p>
              <h3 className="name font-display">{item.name}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
        {groups.map((group) => (
          <section key={group.rarity}>
            <h3>{group.rarity[0].toUpperCase() + group.rarity.slice(1)} relics</h3>
            {group.relics.map((relic) => (
              <article key={relic.id} className={`codex-row relic-${relic.rarity}`}>
                <img className="codex-art" src={`/relics/${relic.id}.png`} alt="" />
                <div>
                  <p className="kicker">
                    {relic.rarity} · {relicCost(relic.rarity)} gold
                  </p>
                  <h3 className="name font-display">{relic.name}</h3>
                  <p>{relic.text}</p>
                </div>
              </article>
            ))}
          </section>
        ))}
        <button type="button" className="btn btn-gold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
