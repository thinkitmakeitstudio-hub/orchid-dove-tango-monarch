import { useEffect, useState, type ReactNode } from "react";
import { CARDS, CLASSES, POUCH_MAX, RELICS, SUPPLIES, computeStats, relicIdsOf } from "@/game/content";
import {
  cardNeeds,
  enemyIntent,
  slotsFor,
} from "@/game/engine";
import { useGame } from "@/game/store";
import type { Floater, HeroState, Run } from "@/game/types";
import { ClassMark, Floaters, PowerCard } from "./cards";
import { GameIcon } from "./icons";
import { GearBook, ItemCodex } from "./overlays";

const HINT: Record<Run["phase"], string> = {
  doors: "Risk, foe count, and loot odds are true. The sentence under them is only a rumor.",
  prep: "Brace for Block equal to Defense, or spend one supply. Then start the clash.",
  battle: "Play one card. Defense subtracts first, then Block. Block fades after the monsters act.",
  enemy: "Monsters are striking. Defense, then Block.",
  treasure: "Claim one relic. Three slots per hero — a keepsake already counts.",
  equip: "Choose who wears it. A full hero must replace a delve relic. Keepsakes stay.",
  supply: "The pouch holds five. Leave extras behind, then pack up.",
  shop: "Buy supplies or relics with gold from cleared fights. The pouch still holds five.",
  curse: "The trap stops at 1 health. The relic inside might be worth the bite.",
  onward: "Deeper halls hit a little harder.",
};

const PHASE_LABEL = [
  ["doors", "Doors"],
  ["prep", "Prep"],
  ["battle", "Battle"],
  ["treasure", "Treasure"],
] as const;

function phaseIndex(phase: Run["phase"]): number {
  if (phase === "doors" || phase === "onward" || phase === "supply" || phase === "shop") return 0;
  if (phase === "prep") return 1;
  if (phase === "battle" || phase === "enemy") return 2;
  return 3;
}

function strikingUid(run: Run): string | null {
  if (run.phase !== "enemy" || run.beat !== "strikes") return null;
  const living = run.enemies.filter((enemy) => enemy.hp > 0);
  const index = run.strikeHitsLeft > 0 ? run.strikeIndex : run.strikeIndex - 1;
  return living[index]?.uid ?? null;
}

type Pick =
  | null
  | { source: "card" | "supply"; id: string; need: "enemy" | "ally" | "any-hero" | "none" };

export function Delve() {
  const run = useGame((s) => s.run);
  const floaters = useGame((s) => s.floaters);
  const shakeId = useGame((s) => s.shakeId);
  const mute = useGame((s) => s.settings.mute);
  const openRules = useGame((s) => s.openRules);
  const toggleMute = useGame((s) => s.toggleMute);
  const abandonAsk = useGame((s) => s.abandonAsk);
  const askAbandon = useGame((s) => s.askAbandon);
  const abandon = useGame((s) => s.abandon);
  const chooseDoor = useGame((s) => s.chooseDoor);
  const brace = useGame((s) => s.brace);
  const applySupply = useGame((s) => s.applySupply);
  const beginBattle = useGame((s) => s.beginBattle);
  const play = useGame((s) => s.playCard);
  const endTurn = useGame((s) => s.endTurn);
  const step = useGame((s) => s.step);
  const acknowledgeCurse = useGame((s) => s.acknowledgeCurse);
  const chooseRelic = useGame((s) => s.chooseRelic);
  const equipRelic = useGame((s) => s.equipRelic);
  const discardSupply = useGame((s) => s.discardSupply);
  const packSupplies = useGame((s) => s.packSupplies);
  const goDeeper = useGame((s) => s.goDeeper);
  const buySupply = useGame((s) => s.buySupply);
  const buyRelic = useGame((s) => s.buyRelic);
  const leaveShop = useGame((s) => s.leaveShop);

  const [pick, setPick] = useState<Pick>(null);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [gear, setGear] = useState(false);
  const [codex, setCodex] = useState(false);

  const handKey = run?.hand.map((c) => c.uid).join("|") ?? "";
  const phase = run?.phase;
  const actor = run?.actorIndex ?? 0;
  const clock = run?.clock ?? 0;
  const round = run?.round ?? 0;

  useEffect(() => {
    setPick(null);
    setReplacing(null);
  }, [phase, actor, handKey, round]);

  useEffect(() => {
    if (phase !== "enemy" || gear) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => step(), reduced ? 160 : 560);
    return () => window.clearTimeout(t);
  }, [phase, clock, step, gear]);

  useEffect(() => {
    if (!shakeId) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShaking(true);
    const t = window.setTimeout(() => setShaking(false), 320);
    return () => window.clearTimeout(t);
  }, [shakeId]);

  if (!run) return null;
  const actorHero = run.party[run.actorIndex];
  const on = phaseIndex(run.phase);
  const attacker = strikingUid(run);
  const upper =
    run.enemies.length > 0 ||
    run.phase === "treasure" ||
    run.phase === "shop" ||
    (run.phase === "equip" && Boolean(run.pendingRelic));

  function storeCapOf(hero: HeroState): number {
    const gear = run?.equipped[hero.id] ?? [];
    return computeStats(hero.classId, hero.level, relicIdsOf(hero.keepsakeId, gear)).storeCap;
  }

  function floats(key: string): Floater[] {
    return floaters.filter((f) => f.key === key);
  }

  function commitPick(target: string | null) {
    if (!pick) return;
    if (pick.source === "card") play(pick.id, target);
    else applySupply(pick.id, target);
    setPick(null);
  }

  function clickHero(hero: HeroState) {
    if (!pick) return;
    if (pick.need === "any-hero") commitPick(hero.id);
    else if (pick.need === "ally" && !hero.down) commitPick(hero.id);
  }

  const pickedCard = pick?.source === "card" ? run.hand.find((c) => c.uid === pick.id) : undefined;
  const pickedSupply = pick?.source === "supply" ? run.supplies.find((s) => s.uid === pick.id) : undefined;
  const pickLabel = pickedCard
    ? (CARDS[pickedCard.cardId]?.name ?? "Card")
    : pickedSupply
      ? (SUPPLIES[pickedSupply.defId]?.name ?? "Supply")
      : "";

  return (
    <div className={`screen scene${shaking ? " is-shaking" : ""}`}>
      <header className="topbar">
        <div>
          <p className="kicker">Depth {run.depth}</p>
          <div className="seals" aria-label={`${run.seals} of 3 seals broken`}>
            {[0, 1, 2].map((i) => (
              <i key={i} className={`seal${i < run.seals ? " is-on" : ""}`} />
            ))}
            <span className="stat">Gold {run.gold}</span>
            <span className="hint">{run.seals}/3 seals</span>
          </div>
        </div>
        <div className="phase-track" aria-label="Phase">
          {PHASE_LABEL.map(([key, label], i) => (
            <span key={key} className={i === on ? "is-on" : ""}>
              {label}
            </span>
          ))}
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-tiny btn-gold" data-testid="open-gear" onClick={() => setGear(true)}>
            Gear
          </button>
          <button type="button" className="btn btn-tiny btn-ghost" data-testid="open-items" onClick={() => setCodex(true)}>
            Items
          </button>
          <button type="button" className="btn btn-tiny btn-ghost" onClick={() => openRules(true)}>
            Rules
          </button>
          <button type="button" className="btn btn-tiny btn-ghost" onClick={toggleMute}>
            {mute ? "Sound off" : "Sound on"}
          </button>
          <button type="button" className="btn btn-tiny btn-ghost" onClick={() => askAbandon(true)}>
            Flee
          </button>
        </div>
      </header>

      <div className="stage">
        {run.phase === "doors" ? (
          <>
            <p className="hint">{HINT.doors}</p>
            {run.intro ? <h2 className="name">{run.intro}</h2> : null}
            <div className="door-grid">
              {run.doors.map((door, i) => (
                <article key={door.uid} className={`door door-${door.kind}`}>
                  <DoorArt kind={door.kind} />
                  <div className="door-body">
                  <p className={`role risk-${door.risk.toLowerCase()}`}>{door.risk} risk</p>
                  <h2 className="name">{door.title}</h2>
                  <p>{door.hint}</p>
                  <p className="chip-name">{door.foes}</p>
                  <p className="hint">{door.lootLabel}</p>
                  {door.odds ? (
                    <>
                      <div className="odds" aria-hidden>
                        <i className="odd-common" style={{ flex: `${door.odds.common} 0 0` }} />
                        <i className="odd-rare" style={{ flex: `${door.odds.rare} 0 0` }} />
                        <i className="odd-mythic" style={{ flex: `${door.odds.mythic} 0 0` }} />
                      </div>
                      <p className="hint">
                        {door.odds.common}% common · {door.odds.rare}% rare · {door.odds.mythic}% mythic
                      </p>
                    </>
                  ) : null}
                  <button type="button" className="btn btn-gold" data-testid={`door-${i}`} onClick={() => chooseDoor(door.uid)}>
                    Enter
                  </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className={`battlefield${upper ? " has-upper" : ""}`}>
            <p className="scene-caption">{run.log.at(-1) || run.intro || HINT[run.phase]}</p>
            {run.enemies.length > 0 ? (
              <div className="foe-line" aria-label="Foes">
                {run.enemies.map((enemy) => {
                  const dead = enemy.hp <= 0;
                  const targetable = !dead && pick?.need === "enemy";
                  const hit = floats(`enemy:${enemy.uid}`).some((f) => f.kind === "dmg");
                  const form = enemy.form || 1;
                  const art =
                    enemy.boss && form > 1
                      ? `/figures/foe-${enemy.defId}-${form}.png`
                      : `/figures/foe-${enemy.defId}.png`;
                  const wide = enemy.defId === "bat" || enemy.defId === "spider" || enemy.defId === "hydra";
                  const swinging = attacker === enemy.uid;
                  const className = `stand${enemy.boss ? ` is-boss is-form-${form}` : ""}${wide ? " is-wide" : ""}${enemy.raging ? " is-raging" : ""}${dead ? " is-down" : ""}${targetable ? " is-target" : ""}${hit ? " is-hit" : ""}${swinging ? " is-striking" : ""}`;
                  const body = (
                    <>
                      <Floaters items={floats(`enemy:${enemy.uid}`)} />
                      <PhaseFlash form={form} />
                      <StandArt src={art} mark={<GameIcon name="skull" />} />
                      <div className="stand-plate">
                        {enemy.boss && form > 1 && enemy.formName ? <p className="role">{enemy.formName}</p> : null}
                        <p className="chip-name">
                          {enemy.name}
                          {dead ? " · Down" : ` · ${enemy.hp}/${enemy.maxHp}`}
                        </p>
                        <VitalBar hp={enemy.hp} maxHp={enemy.maxHp} poison={enemy.poison} bleed={enemy.bleed} shield={0} foe />
                        <p className="hint">
                          {dead ? "Defeated" : enemyIntent(enemy, run.round)}
                          {!dead && enemy.armor > 0 ? ` · Armor ${enemy.armor}` : ""}
                          {!dead && enemy.pierce > 0 ? ` · Pierce ${enemy.pierce}` : ""}
                          {!dead && enemy.poison > 0 ? ` · Poison ${enemy.poison}` : ""}
                          {!dead && enemy.bleed > 0 ? ` · Bleed ${enemy.bleed}` : ""}
                        </p>
                        {enemy.boss && (enemy.forms || 1) > 1 ? (
                          <div className="form-pips" aria-label={`Form ${form} of ${enemy.forms}`}>
                            {Array.from({ length: enemy.forms }, (_, i) => (
                              <i key={i} className={`form-pip${i < form ? " is-on" : ""}`} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </>
                  );
                  if (targetable) {
                    return (
                      <button key={swinging ? `${enemy.uid}-${run.clock}` : enemy.uid} type="button" className={className} onClick={() => commitPick(enemy.uid)}>
                        {body}
                      </button>
                    );
                  }
                  return (
                    <div key={swinging ? `${enemy.uid}-${run.clock}` : enemy.uid} className={className}>
                      {body}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {run.enemies.length === 0 && (run.phase === "treasure" || (run.phase === "equip" && run.pendingRelic)) ? (
              <div className="foe-line is-loot-row" aria-label="Relics">
                {(run.phase === "equip" && run.pendingRelic
                  ? [{ uid: "pending", defId: run.pendingRelic }]
                  : run.offer
                ).map((offer, i) => {
                  const relic = RELICS[offer.defId];
                  const picking = run.phase === "treasure";
                  const body = (
                    <>
                      <StandArt src={`/relics/${offer.defId}.png`} mark={<GameIcon name={relic?.rarity === "mythic" ? "crown" : "gem"} />} />
                      <div className="stand-plate is-wares">
                        <p className="role">
                          {relic?.rarity ?? "relic"}
                          {relic?.classes?.length
                            ? ` · ${relic.classes.map((id) => CLASSES[id]?.name ?? id).join(", ")}`
                            : ""}
                        </p>
                        <p className="chip-name">{relic?.name ?? "Relic"}</p>
                        <p className="hint">{relic?.text}</p>
                      </div>
                    </>
                  );
                  if (!picking) {
                    return (
                      <div key={offer.uid} className={`stand is-loot is-${relic?.rarity ?? "common"}`}>
                        {body}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={offer.uid}
                      type="button"
                      className={`stand is-loot is-${relic?.rarity ?? "common"}`}
                      data-testid={`relic-${i}`}
                      onClick={() => chooseRelic(offer.uid)}
                    >
                      {body}
                    </button>
                  );
                })}
              </div>
            ) : null}
            {run.phase === "shop" ? (
              <div className="foe-line is-stall" aria-label="Stall">
                {(["supply", "relic"] as const).map((kind) => {
                  const items = run.shop.filter((item) => item.kind === kind);
                  if (items.length === 0) return null;
                  return (
                    <div key={kind} className="ware-band">
                      <p className="ware-kicker">{kind === "supply" ? "Supplies" : "Relics"}</p>
                      <div className="ware-items">
                        {items.map((item) => {
                          const relic = item.kind === "relic" ? RELICS[item.defId] : undefined;
                          const supply = item.kind === "supply" ? SUPPLIES[item.defId] : undefined;
                          const name = relic?.name ?? supply?.name ?? "Goods";
                          const text = relic?.text ?? supply?.text ?? "";
                          const broke = run.gold < item.price;
                          const full = item.kind === "supply" && run.supplies.length >= POUCH_MAX;
                          return (
                            <button
                              key={item.uid}
                              type="button"
                              className={`stand is-loot is-${relic?.rarity ?? "common"}${broke || full ? " is-down" : ""}`}
                              data-testid={`ware-${item.uid}`}
                              disabled={broke || full}
                              onClick={() => (item.kind === "supply" ? buySupply(item.uid) : buyRelic(item.uid))}
                            >
                              <StandArt
                                src={item.kind === "relic" ? `/relics/${item.defId}.png` : `/supplies/${item.defId}.png`}
                                mark={<GameIcon name={item.kind === "relic" ? "gem" : "pack"} />}
                              />
                              <div className="stand-plate is-wares">
                                <p className="role">{item.price} gold</p>
                                <p className="chip-name">{name}</p>
                                <p className="hint">{broke ? "Not enough gold" : full ? "Pouch full" : text}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <div
              className={`hero-line${run.enemies.length > 0 || run.phase === "treasure" || run.phase === "shop" || (run.phase === "equip" && run.pendingRelic) ? " is-below" : ""}`}
              aria-label="Party"
            >
              {run.party.map((hero) => {
                const targetable = Boolean(pick && (pick.need === "any-hero" || (pick.need === "ally" && !hero.down)));
                const hit = floats(`hero:${hero.id}`).some((f) => f.kind === "dmg");
                const acting = run.phase === "battle" && actorHero?.id === hero.id;
                const className = `stand class-${hero.classId}${hero.down ? " is-down" : ""}${acting ? " is-actor" : ""}${targetable ? " is-target" : ""}${hit ? " is-hit" : ""}`;
                const slots = run.phase === "equip" ? slotsFor(run, hero) : null;
                const pending = run.pendingRelic ? RELICS[run.pendingRelic] : undefined;
                const wrongClass = Boolean(pending?.classes?.length && !pending.classes.includes(hero.classId));
                const body = (
                  <>
                    <Floaters items={floats(`hero:${hero.id}`)} />
                    <StandArt src={`/figures/hero-${hero.classId}.png`} mark={<ClassMark classId={hero.classId} />} />
                    <div className="stand-plate">
                      {acting ? <p className="turn-flag">Your turn</p> : null}
                      <p className={`chip-name${acting ? " is-turn" : ""}`}>
                        {hero.name}
                        {hero.down ? " · Down" : ""}
                      </p>
                      {acting ? (
                        <p className="hint">
                          {hero.hp}/{hero.maxHp}
                          {hero.maxMana > 0 ? ` · Mana ${hero.mana}/${hero.maxMana}` : ""}
                          {run.playsLeft > 1 ? " · plays twice" : ""}
                        </p>
                      ) : null}
                      <VitalBar hp={hero.hp} maxHp={hero.maxHp} poison={hero.poison} shield={hero.block} />
                      <ManaBar mana={hero.mana} max={hero.maxMana} />
                      <p className="hint">
                        ATK {hero.atk + hero.atkBuff} · DEF {hero.def + hero.defBuff}
                        {hero.block > 0 ? ` · Block ${hero.block}` : ""}
                        {hero.poison > 0 ? ` · Poison ${hero.poison}` : ""}
                        {storeCapOf(hero) > 0 ? (
                          <span className={hero.stored >= storeCapOf(hero) ? "grudge-full" : ""}>
                            {` · Stored ${hero.stored}/${storeCapOf(hero)}`}
                          </span>
                        ) : null}
                        {!acting && hero.maxMana > 0 ? ` · Mana ${hero.mana}/${hero.maxMana}` : ""}
                      </p>
                      {run.phase === "prep" && !hero.down && !targetable ? (
                        <button
                          type="button"
                          className="btn btn-tiny btn-ghost"
                          disabled={hero.braced}
                          onClick={() => brace(hero.id)}
                        >
                          {hero.braced ? "Braced" : `Brace +${hero.def + hero.defBuff}`}
                        </button>
                      ) : null}
                      {slots && !replacing ? (
                        <button
                          type="button"
                          className="btn btn-tiny btn-gold"
                          disabled={wrongClass}
                          onClick={() => {
                            if (wrongClass) return;
                            if (slots.free > 0) equipRelic(hero.id, null);
                            else setReplacing(hero.id);
                          }}
                        >
                          {wrongClass ? "Not their art" : slots.free > 0 ? "Wear" : "Full"}
                        </button>
                      ) : null}
                    </div>
                  </>
                );
                if (targetable) {
                  return (
                    <button key={hero.id} type="button" className={className} onClick={() => clickHero(hero)}>
                      {body}
                    </button>
                  );
                }
                return (
                  <div key={hero.id} className={className}>
                    {body}
                  </div>
                );
              })}
              {(run.minions ?? [])
                .filter((minion) => minion.hp > 0)
                .map((minion) => (
                  <div key={minion.uid} className="stand is-minion">
                    <Floaters items={floats(`minion:${minion.uid}`)} />
                    <StandArt src="/figures/minion-thrall.png" mark={<GameIcon name="skull" />} />
                    <div className="stand-plate">
                      <p className="chip-name">{minion.name}</p>
                      <VitalBar hp={minion.hp} maxHp={minion.maxHp} poison={0} shield={0} />
                      <p className="hint">ATK {minion.atk}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <footer className="action-bar card-dock">
        {run.phase !== "battle" && run.phase !== "enemy" ? <p className="hint">{HINT[run.phase]}</p> : null}
        {run.phase === "prep" ? (
          <>
            <div className="h-scroll">
              {run.supplies.length === 0 ? <p className="hint">Pouch empty.</p> : null}
              {run.supplies.map((inst) => (
                <PowerCard
                  key={inst.uid}
                  cardId={inst.defId}
                  atk={0}
                  atkBuff={0}
                  disabled={run.prepSupplyUsed}
                  selected={pick?.source === "supply" && pick.id === inst.uid}
                  onClick={() => {
                    if (run.prepSupplyUsed) return;
                    const need = cardNeeds(inst.defId);
                    setPick({ source: "supply", id: inst.uid, need });
                  }}
                />
              ))}
            </div>
            {pick?.source === "supply" ? (
              <PickBar
                label={pickLabel}
                need={pick.need}
                onPlay={() => commitPick(null)}
                onCancel={() => setPick(null)}
              />
            ) : (
              <button type="button" className="btn btn-gold" data-testid="begin-battle" onClick={beginBattle}>
                Begin the clash
              </button>
            )}
          </>
        ) : null}

        {run.phase === "battle" && actorHero ? (
          <>
            <div className={`turn-banner class-${actorHero.classId}`} data-testid="turn-banner">
              <span className="turn-seat">Player {actorHero.seat + 1}</span>
              <span className="turn-name">{actorHero.name}</span>
              {actorHero.maxMana > 0 ? (
                <span className="turn-note">
                  Mana {actorHero.mana}/{actorHero.maxMana}
                  {actorHero.freeSpell ? " · next spell free" : ""}
                </span>
              ) : null}
              {storeCapOf(actorHero) > 0 ? (
                <span className={`turn-note${actorHero.stored >= storeCapOf(actorHero) ? " grudge-full" : ""}`}>
                  Stored {actorHero.stored}/{storeCapOf(actorHero)}
                </span>
              ) : null}
              <span className="turn-note">{run.playsLeft > 1 ? "plays twice" : "your cards"}</span>
            </div>
            <div className="h-scroll deal">
              {run.hand.map((card, i) => {
                const def = CARDS[card.cardId];
                const cost = def?.mana ?? 0;
                const rite = def?.effects.some((e) => e.op === "free-spell") ?? false;
                const free = actorHero.freeSpell && cost > 0;
                const spent = rite && actorHero.freeSpellUsed;
                const held = rite && actorHero.freeSpell && !actorHero.freeSpellUsed;
                const grudge = def?.effects.some((e) => e.op === "grudge") ?? false;
                const cap = grudge ? storeCapOf(actorHero) : 0;
                const grudgeReady = grudge && cap > 0 && actorHero.stored >= cap;
                const grudgeWait = grudge && !grudgeReady;
                return (
                  <PowerCard
                    key={card.uid}
                    cardId={card.cardId}
                    atk={actorHero.atk}
                    atkBuff={actorHero.atkBuff}
                    dry={(cost > 0 && !free && cost > actorHero.mana) || spent || held || grudgeWait}
                    free={free}
                    spent={spent}
                    held={held}
                    badge={grudge ? (grudgeReady ? "ready" : `${actorHero.stored}/${cap || 12}`) : undefined}
                    badgeHot={grudgeReady}
                    accent={actorHero.classId}
                    testId={`hand-${i}`}
                    selected={pick?.source === "card" && pick.id === card.uid}
                    onClick={() => setPick({ source: "card", id: card.uid, need: cardNeeds(card.cardId) })}
                  />
                );
              })}
            </div>
            {pick?.source === "card" ? (
              <PickBar label={pickLabel} need={pick.need} onPlay={() => commitPick(null)} onCancel={() => setPick(null)} />
            ) : (
              <p className="hint">Tap a card, then confirm. Or end the turn.</p>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="end-turn"
              onClick={() => {
                setPick(null);
                endTurn();
              }}
            >
              End turn
            </button>
          </>
        ) : null}

        {run.phase === "treasure" ? (
          <button type="button" className="btn btn-ghost" onClick={() => chooseRelic("none")}>
            Leave the relics
          </button>
        ) : null}

        {run.phase === "equip" && run.pendingRelic ? (
          <>
            {replacing ? (
              <div className="inline-actions">
                <p className="hint">Replace one of {run.party.find((h) => h.id === replacing)?.name}'s delve relics.</p>
                {(run.equipped[replacing] ?? []).map((id) => (
                  <button key={id} type="button" className="btn btn-tiny btn-ghost" onClick={() => equipRelic(replacing, id)}>
                    Replace {RELICS[id]?.name}
                  </button>
                ))}
                <button type="button" className="btn btn-tiny btn-ghost" onClick={() => setReplacing(null)}>
                  Back
                </button>
              </div>
            ) : (
              <p className="hint">Tap Wear on whoever should carry it.</p>
            )}
          </>
        ) : null}

        {run.phase === "supply" ? (
          <div className="h-scroll">
            {run.supplies.map((inst) => (
              <div key={inst.uid} className="playing-card">
                <span className="card-kicker">Supply</span>
                <span className="card-name font-display">{SUPPLIES[inst.defId]?.name}</span>
                <span className="card-text">{SUPPLIES[inst.defId]?.text}</span>
                {run.supplies.length > POUCH_MAX ? (
                  <button type="button" className="btn btn-tiny btn-ghost" onClick={() => discardSupply(inst.uid)}>
                    Leave behind
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {run.phase === "enemy" ? (
          <button type="button" className="btn btn-ghost" onClick={step}>
            Hasten the strikes
          </button>
        ) : null}

        {run.phase === "curse" ? (
          <button type="button" className="btn btn-gold" onClick={acknowledgeCurse}>
            Search the wreckage
          </button>
        ) : null}

        {run.phase === "supply" ? (
          <button
            type="button"
            className="btn btn-gold"
            disabled={run.supplies.length > POUCH_MAX}
            onClick={packSupplies}
          >
            {run.supplies.length > POUCH_MAX ? `Leave ${run.supplies.length - POUCH_MAX} more` : "Pack up"}
          </button>
        ) : null}

        {run.phase === "shop" ? (
          <button type="button" className="btn btn-gold" data-testid="leave-shop" onClick={leaveShop}>
            Leave the stall · {run.gold} gold
          </button>
        ) : null}

        {run.phase === "onward" ? (
          <button type="button" className="btn btn-gold" onClick={goDeeper}>
            {run.clearedNote || "Deeper"}
          </button>
        ) : null}
      </footer>

      {abandonAsk ? (
        <div className="overlay" role="presentation" onClick={() => askAbandon(false)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="flee-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="flee-title">Flee the delve?</h2>
            <p>Experience already earned stays with the guild. Relics from this delve do not.</p>
            <div className="inline-actions">
              <button type="button" className="btn btn-blood" onClick={abandon}>
                Flee
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => askAbandon(false)}>
                Stay
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {gear ? <GearBook onClose={() => setGear(false)} /> : null}
      {codex ? <ItemCodex onClose={() => setCodex(false)} /> : null}
    </div>
  );
}

function DoorArt({ kind }: { kind: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      className="door-art"
      src={`/doors/door-${kind}.jpg`}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

function VitalBar({
  hp,
  maxHp,
  poison,
  bleed = 0,
  shield,
  foe,
}: {
  hp: number;
  maxHp: number;
  poison: number;
  bleed?: number;
  shield: number;
  foe?: boolean;
}) {
  const life = Math.max(0, hp);
  const guard = Math.max(0, shield);
  const scale = Math.max(1, maxHp, life + guard);
  const bleedAmt = Math.min(life, Math.max(0, bleed));
  const poisonAmt = Math.min(Math.max(0, life - bleedAmt), Math.max(0, poison));
  const safe = life - bleedAmt - poisonAmt;
  const safePct = (safe / scale) * 100;
  const poisonPct = (poisonAmt / scale) * 100;
  const bleedPct = (bleedAmt / scale) * 100;
  const lifePct = (life / scale) * 100;
  const shieldPct = (guard / scale) * 100;
  return (
    <div className={`hp${foe ? " hp-foe" : ""}`} aria-hidden>
      <span className="hp-life" style={{ width: `${safePct}%` }} />
      {poisonAmt > 0 ? <span className="hp-poison" style={{ width: `${poisonPct}%`, left: `${safePct}%` }} /> : null}
      {bleedAmt > 0 ? (
        <span className="hp-bleed" style={{ width: `${bleedPct}%`, left: `${safePct + poisonPct}%` }} />
      ) : null}
      {guard > 0 ? <span className="hp-shield" style={{ width: `${shieldPct}%`, left: `${lifePct}%` }} /> : null}
    </div>
  );
}

function ManaBar({ mana, max }: { mana: number; max: number }) {
  if (max <= 0) return null;
  return (
    <div className="mana" aria-label={`Mana ${mana} of ${max}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, (mana / max) * 100))}%` }} />
    </div>
  );
}

function PhaseFlash({ form }: { form: number }) {
  if (form <= 1) return null;
  return <span key={form} className="phase-flash" aria-hidden />;
}

function StandArt({ src, mark }: { src: string; mark: ReactNode }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) return <span className="stand-fallback">{mark}</span>;
  return <img src={src} alt="" draggable={false} onError={() => setFailed(true)} />;
}

function PickBar({
  label,
  need,
  onPlay,
  onCancel,
}: {
  label: string;
  need: "enemy" | "ally" | "any-hero" | "none";
  onPlay: () => void;
  onCancel: () => void;
}) {
  const prompt =
    need === "enemy" ? `Choose a foe for ${label}` : need === "none" ? `Play ${label}` : `Choose a hero for ${label}`;
  return (
    <div className="inline-actions">
      {need === "none" ? (
        <button type="button" className="btn btn-gold" onClick={onPlay}>
          {prompt}
        </button>
      ) : (
        <p className="hint">{prompt}</p>
      )}
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
