import { useState } from "react";
import { CLASSES, CLASS_ORDER, RELICS, computeStats, relicIdsOf, xpThreshold, LEVEL_CAP } from "@/game/content";
import { useGame } from "@/game/store";
import { ClassMark } from "./cards";
import { GearBook, ItemCodex } from "./overlays";

const HALL = ["", "Calm halls", "Stirring halls", "Dangerous halls", "Brutal halls"];

export function Camp() {
  const roster = useGame((s) => s.roster);
  const partyIds = useGame((s) => s.partyIds);
  const stats = useGame((s) => s.stats);
  const mute = useGame((s) => s.settings.mute);
  const toggleHero = useGame((s) => s.toggleHero);
  const toggleMute = useGame((s) => s.toggleMute);
  const openRules = useGame((s) => s.openRules);
  const openSheet = useGame((s) => s.openSheet);
  const start = useGame((s) => s.start);
  const [gear, setGear] = useState(false);
  const [codex, setCodex] = useState(false);

  return (
    <div className="screen">
      <div className="scroll-body">
      <header className="mast">
        <p className="kicker">Guild hall</p>
        <h1>Adventure Cards</h1>
        <p className="lede">
          Draft up to four heroes, pick a door, and break three seals before the Hollow King. Pass the device for
          co-op, or take the table alone.
        </p>
        <p className="sub">
          {stats.wins} wins · {stats.runs} delves · {stats.bosses} bosses slain
        </p>
        <div className="mast-actions">
          <button type="button" className="btn btn-ghost" data-testid="open-gear" onClick={() => setGear(true)}>
            Gear
          </button>
          <button type="button" className="btn btn-ghost" data-testid="open-items" onClick={() => setCodex(true)}>
            Items
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => openRules(true)}>
            How to play
          </button>
          <button type="button" className="btn btn-ghost" onClick={toggleMute}>
            {mute ? "Sound off" : "Sound on"}
          </button>
        </div>
      </header>

      <section className="section">
        <h2>The table</h2>
        <p className="hint">
          {partyIds.length === 0
            ? "Seat at least one hero."
            : `${partyIds.length} seated · ${HALL[partyIds.length]}. More heroes, tougher foes.`}
        </p>
        <div className="seats">
          {Array.from({ length: 4 }, (_, i) => {
            const id = partyIds[i];
            const hero = roster.find((h) => h.id === id);
            const cls = id ? CLASSES[id] : undefined;
            if (!hero || !cls) {
              return (
                <div key={i} className="seat is-empty">
                  <p className="seat-no">Player {i + 1}</p>
                  <p className="name font-display">Empty seat</p>
                  <p className="hint">Choose a hero below.</p>
                </div>
              );
            }
            return (
              <button key={id} type="button" className={`seat class-${id}`} onClick={() => toggleHero(id)}>
                <div className="roster-row">
                  <img className="roster-portrait" src={`/figures/hero-${id}.png`} alt="" />
                  <div className="roster-body">
                    <p className="seat-no">Player {i + 1}</p>
                    <p className="name font-display">{hero.name}</p>
                    <p className="role">{cls.name}</p>
                    <p className="hint">Tap to unseat</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2>Guild roster</h2>
        <p className="hint">Heroes keep their levels. Relics last one delve — a single keepsake may come home if you win.</p>
        <div className="roster">
          {CLASS_ORDER.map((id) => {
            const hero = roster.find((h) => h.id === id);
            const cls = CLASSES[id];
            if (!hero || !cls) return null;
            const open = hero.unlocked || !cls.unlock;
            const seated = partyIds.includes(id);
            const statsNow = computeStats(id, hero.level, relicIdsOf(hero.keepsakeId, []));
            const need = xpThreshold(hero.level);
            const pct = hero.level >= LEVEL_CAP || need === 0 ? 100 : Math.min(100, (hero.xp / need) * 100);
            return (
              <article key={id} className={`hero-plate class-${id}${open ? "" : " is-locked"}${seated ? " is-seated" : ""}`}>
                <div className="roster-row">
                  <img className="roster-portrait" src={`/figures/hero-${id}.png`} alt="" />
                  <div className="roster-body">
                <div className="plate-top">
                  <div>
                    <p className="role">{cls.role}</p>
                    <h3 className="name font-display">{hero.name}</h3>
                    <p className="hint">{cls.name}</p>
                  </div>
                  <ClassMark classId={id} />
                </div>
                {open ? (
                  <>
                    <div className="stats-row">
                      <span className="stat">Lv {hero.level}</span>
                      <span className="stat">HP {statsNow.maxHp}</span>
                      <span className="stat">ATK {statsNow.atk}</span>
                      <span className="stat">DEF {statsNow.def}</span>
                      {cls.mana ? <span className="stat">Mana {cls.mana}</span> : null}
                    </div>
                    <div className="xp" aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <p className="hint">
                      {hero.level >= LEVEL_CAP ? "Max level" : `${hero.xp} / ${need} xp`}
                      {hero.keepsakeId && RELICS[hero.keepsakeId] ? ` · Keepsake: ${RELICS[hero.keepsakeId].name}` : ""}
                    </p>
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="btn btn-tiny btn-gold"
                        data-testid={`roster-${id}`}
                        onClick={() => toggleHero(id)}
                        disabled={!seated && partyIds.length >= 4}
                      >
                        {seated ? "Unseat" : "Seat"}
                      </button>
                      <button type="button" className="btn btn-tiny btn-ghost" onClick={() => openSheet(id)}>
                        Deck
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="lock-line">{cls.unlock?.label}</p>
                    <p className="hint">{cls.blurb}</p>
                    <button type="button" className="btn btn-tiny btn-ghost" onClick={() => openSheet(id)}>
                      Preview
                    </button>
                  </>
                )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      </div>

      <footer className="action-bar">
        <button
          type="button"
          className="btn btn-gold"
          data-testid="begin-delve"
          disabled={partyIds.length === 0}
          onClick={start}
        >
          Begin delve
        </button>
      </footer>
      {gear ? <GearBook onClose={() => setGear(false)} /> : null}
      {codex ? <ItemCodex onClose={() => setCodex(false)} /> : null}
    </div>
  );
}
