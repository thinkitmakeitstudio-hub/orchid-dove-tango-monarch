import {
  BOSS_DOOR,
  CARDS,
  CLASSES,
  DOOR_TEMPLATES,
  ELITE_DECK,
  FINAL_DOOR,
  LEVEL_CAP,
  MINIBOSS_IDS,
  MONSTERS,
  POUCH_MAX,
  RELICS,
  STANDARD_DECK,
  SUPPLIES,
  SUPPLY_COST,
  SUPPLY_DECK,
  TREASURE_DECKS,
  WEAK_DECK,
  computeStats,
  deckFor,
  foePlan,
  relicCost,
  relicIdsOf,
  xpThreshold,
} from "./content";
import type {
  DoorKind,
  DoorState,
  Effect,
  EnemyState,
  GameEvent,
  HandCard,
  HeroState,
  PersistedHero,
  Rarity,
  Run,
  ShopEntry,
  StepResult,
} from "./types";

function rngNext(state: number): { value: number; state: number } {
  let a = state | 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: a >>> 0 };
}

function roll(run: Run): number {
  const n = rngNext(run.rng >>> 0);
  run.rng = n.state;
  return n.value;
}

export function shuffle<T>(list: T[], rnd: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = a[i];
    a[i] = a[j]!;
    a[j] = tmp!;
  }
  return a;
}

function nextUid(run: Run, prefix: string): string {
  run.uid += 1;
  return `${prefix}-${run.uid}`;
}

function log(run: Run, line: string) {
  run.log = [...run.log, line].slice(-40);
}

function clone(run: Run): Run {
  return structuredClone(run);
}

function livingHeroes(run: Run): HeroState[] {
  return run.party.filter((h) => !h.down && h.hp > 0);
}

function livingEnemies(run: Run): EnemyState[] {
  return run.enemies.filter((e) => e.hp > 0);
}

function heroById(run: Run, id: string | null): HeroState | undefined {
  if (!id) return undefined;
  return run.party.find((h) => h.id === id);
}

function enemyById(run: Run, id: string | null): EnemyState | undefined {
  if (!id) return undefined;
  return run.enemies.find((e) => e.uid === id);
}

function relicBuild(hero: HeroState, run: Run) {
  const equipped = run.equipped[hero.id] ?? [];
  return computeStats(hero.classId, hero.level, relicIdsOf(hero.keepsakeId, equipped));
}

function recompute(hero: HeroState, run: Run, healDelta: boolean) {
  const before = hero.maxHp;
  const stats = relicBuild(hero, run);
  hero.maxHp = stats.maxHp;
  hero.atk = stats.atk;
  hero.def = stats.def;
  if (healDelta && stats.maxHp > before) hero.hp += stats.maxHp - before;
  if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
  if (hero.hp < 0) hero.hp = 0;
}

function partyLow(run: Run): boolean {
  return run.party.some((h) => h.down || h.hp / Math.max(1, h.maxHp) <= 0.3);
}

function grantXp(run: Run, hero: HeroState, amount: number, events: GameEvent[]) {
  if (amount <= 0 || hero.level >= LEVEL_CAP) return;
  hero.xp += amount;
  run.xpGained[hero.id] = (run.xpGained[hero.id] ?? 0) + amount;
  while (hero.level < LEVEL_CAP && hero.xp >= xpThreshold(hero.level)) {
    hero.xp -= xpThreshold(hero.level);
    hero.level += 1;
    const before = hero.maxHp;
    recompute(hero, run, false);
    const gain = Math.max(0, hero.maxHp - before);
    hero.hp += gain;
    const fresh = deckFor(hero.classId, hero.level);
    const known = new Set([...hero.deck, ...hero.discard, ...hero.exhaust, ...run.hand.map((c) => c.cardId)]);
    for (const id of fresh) {
      if (!known.has(id)) {
        hero.discard.push(id);
        known.add(id);
      }
    }
    const line = `${hero.name} reaches level ${hero.level}.`;
    log(run, line);
    events.push({ banner: line, sfx: "unlock" });
  }
  if (hero.level >= LEVEL_CAP) hero.xp = 0;
}

function grantPartyXp(run: Run, amount: number, events: GameEvent[]) {
  for (const h of run.party) grantXp(run, h, amount, events);
}

const WEAKEN_CAP = 8;

function hallPressure(run: Run): number {
  return Math.max(0, run.round - 20);
}

function effectiveAtk(run: Run, e: EnemyState): number {
  return Math.max(1, e.atk - e.weaken) + hallPressure(run);
}

function pull(deck: string[], discard: string[], rnd: () => number): { id: string | null; deck: string[]; discard: string[] } {
  let d = deck.slice();
  let g = discard.slice();
  if (d.length === 0) {
    if (g.length === 0) return { id: null, deck: d, discard: g };
    d = shuffle(g, rnd);
    g = [];
  }
  const id = d.pop() ?? null;
  return { id, deck: d, discard: g };
}

function drawIds(deck: string[], discard: string[], n: number, rnd: () => number) {
  let d = deck;
  let g = discard;
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const got = pull(d, g, rnd);
    d = got.deck;
    g = got.discard;
    if (!got.id) break;
    ids.push(got.id);
  }
  return { ids, deck: d, discard: g };
}

function dealHand(run: Run, hero: HeroState) {
  const rnd = () => roll(run);
  const got = drawIds(hero.deck, hero.discard, 3, rnd);
  hero.deck = got.deck;
  hero.discard = got.discard;
  run.hand = got.ids.map((cardId) => ({ uid: nextUid(run, "c"), cardId }));
  if (run.hand.length === 0) {
    run.hand = [{ uid: nextUid(run, "c"), cardId: "basic-strike" }];
  }
}

function giveBlock(run: Run, hero: HeroState, amount: number, events: GameEvent[]) {
  if (amount <= 0 || hero.down) return;
  hero.block += amount;
  events.push({
    sfx: "block",
    floater: { key: `hero:${hero.id}`, text: `+${amount}`, kind: "block" },
  });
  const build = relicBuild(hero, run);
  if (build.thorns > 0) {
    const foes = livingEnemies(run);
    if (foes.length) {
      const foe = foes[Math.floor(roll(run) * foes.length)]!;
      damageEnemy(run, foe, build.thorns, false, events, `${hero.name}'s thorns bite ${foe.name}.`);
    }
  }
  if (build.manaOnBlock) gainMana(hero, build.manaOnBlock, events);
}

function gainMana(hero: HeroState, amount: number, events: GameEvent[]) {
  if (amount <= 0 || hero.down || hero.maxMana <= 0) return;
  const before = hero.mana;
  hero.mana = Math.min(hero.maxMana, hero.mana + amount);
  const gained = hero.mana - before;
  if (gained <= 0) return;
  events.push({
    sfx: "heal",
    floater: { key: `hero:${hero.id}`, text: `+${gained} mana`, kind: "buff" },
  });
}

function healHero(hero: HeroState, amount: number, events: GameEvent[]) {
  if (hero.down || amount <= 0) return;
  const before = hero.hp;
  hero.hp = Math.min(hero.maxHp, hero.hp + amount);
  const gained = hero.hp - before;
  if (gained > 0) {
    events.push({
      sfx: "heal",
      floater: { key: `hero:${hero.id}`, text: `+${gained}`, kind: "heal" },
    });
  }
}

function fellHero(run: Run, hero: HeroState, events: GameEvent[]) {
  const ward = relicBuild(hero, run).deathWard && !hero.deathWardUsed;
  if (ward) {
    hero.deathWardUsed = true;
    hero.hp = 1;
    hero.down = false;
    log(run, `${hero.name}'s keepsake flares. They stay at 1.`);
    events.push({
      sfx: "heal",
      banner: `${hero.name} refuses to fall.`,
      floater: { key: `hero:${hero.id}`, text: "+1", kind: "heal" },
    });
    return;
  }
  hero.hp = 0;
  hero.down = true;
  hero.block = 0;
  log(run, `${hero.name} is down.`);
  events.push({ sfx: "hit", shake: true, floater: { key: `hero:${hero.id}`, text: "Down", kind: "dmg" } });
}

function chargeStore(run: Run, hero: HeroState, amount: number, events: GameEvent[]) {
  const cap = relicBuild(hero, run).storeCap ?? 0;
  if (cap <= 0 || amount <= 0 || hero.down) return;
  const before = hero.stored || 0;
  hero.stored = Math.min(cap, before + amount);
  const gained = hero.stored - before;
  if (gained <= 0) return;
  const full = hero.stored >= cap;
  events.push({
    sfx: "ui",
    floater: { key: `hero:${hero.id}`, text: full ? "Full" : `+${gained} stored`, kind: "buff" },
  });
  if (full && before < cap) log(run, `${hero.name}'s grudge is full.`);
}

function hurtHero(run: Run, hero: HeroState, amount: number, events: GameEvent[], ignoreBlock: boolean) {
  if (hero.down || amount <= 0) return;
  let incoming = amount;
  let weathered = 0;
  if (!ignoreBlock && hero.block > 0) {
    const blocked = Math.min(hero.block, incoming);
    hero.block -= blocked;
    incoming -= blocked;
    weathered += blocked;
    if (blocked > 0 && incoming <= 0) {
      chargeStore(run, hero, weathered, events);
      events.push({ floater: { key: `hero:${hero.id}`, text: "Blocked", kind: "miss" }, sfx: "block" });
      return;
    }
  }
  if (incoming <= 0) return;
  hero.hp -= incoming;
  if (!ignoreBlock) {
    weathered += incoming;
    chargeStore(run, hero, weathered, events);
  }
  events.push({
    sfx: "hit",
    shake: incoming >= 6,
    floater: { key: `hero:${hero.id}`, text: `−${incoming}`, kind: "dmg" },
  });
  if (hero.hp <= 0) fellHero(run, hero, events);
}

function noteBossDeath(run: Run, enemy: EnemyState, events: GameEvent[]) {
  const low = partyLow(run);
  if (low) run.lowHpBossKill = true;
  if (enemy.final) run.finalSlain = true;
  else run.seals = Math.min(3, run.seals + 1);
  run.bossesSlain = [...run.bossesSlain, enemy.defId];
  const line = enemy.final ? `${enemy.name} falls. The dungeon exhales.` : `Seal broken — ${enemy.name} is slain. (${run.seals}/3)`;
  log(run, line);
  events.push({ banner: line, sfx: "rage", shake: true, bossDead: { id: enemy.defId, lowHp: low, final: enemy.final } });
}

function damageEnemy(run: Run, enemy: EnemyState, amount: number, useArmor: boolean, events: GameEvent[], quiet?: string) {
  if (enemy.hp <= 0 || amount <= 0) return 0;
  if (typeof enemy.baseAtk !== "number") enemy.baseAtk = enemy.atk;
  if (typeof enemy.form !== "number") enemy.form = 1;
  if (typeof enemy.forms !== "number") enemy.forms = enemy.boss ? (MONSTERS[enemy.defId]?.phases ?? 1) : 1;
  if (typeof enemy.alwaysCleave !== "boolean") enemy.alwaysCleave = false;
  if (typeof enemy.alwaysDouble !== "boolean") enemy.alwaysDouble = false;
  const dealt = useArmor ? Math.max(1, amount - enemy.armor) : Math.max(1, amount);
  enemy.hp -= dealt;
  events.push({
    sfx: "hit",
    shake: dealt >= 8 || enemy.boss,
    floater: { key: `enemy:${enemy.uid}`, text: `−${dealt}`, kind: "dmg" },
  });
  if (!quiet) log(run, `${enemy.name} takes ${dealt}.`);
  else log(run, quiet.replace("{d}", String(dealt)));
  if (!enemy.halfEnraged && enemy.enrageAtHalf > 0 && enemy.hp > 0 && enemy.hp * 2 <= enemy.maxHp) {
    enemy.halfEnraged = true;
    enemy.baseAtk += enemy.enrageAtHalf;
    log(run, `${enemy.name} surges (+${enemy.enrageAtHalf} Attack).`);
  }
  if (!enemy.raging && enemy.rageAt > 0 && enemy.hp > 0 && enemy.hp / enemy.maxHp <= enemy.rageAt) {
    enemy.raging = true;
    const line = `${enemy.name} enters a rage.`;
    log(run, line);
    events.push({ banner: line, sfx: "rage", shake: true });
  }
  enemy.atk = enemy.baseAtk + (enemy.raging ? enemy.rageBonus : 0);
  if (enemy.hp <= 0) {
    if (tryAscend(run, enemy, events)) return dealt;
    enemy.hp = 0;
    log(run, `${enemy.name} is defeated.`);
    const xp = enemy.xp;
    for (const h of run.party) grantXp(run, h, xp, events);
    if (enemy.boss) noteBossDeath(run, enemy, events);
  }
  return dealt;
}

function strikeHero(run: Run, enemy: EnemyState, hero: HeroState, events: GameEvent[]) {
  if (enemy.skip || enemy.hp <= 0 || hero.down) return;
  const atk = effectiveAtk(run, enemy);
  const cleave = enemy.alwaysCleave || (enemy.raging && enemy.rageCleave);
  const targets = cleave ? livingHeroes(run) : [hero];
  for (const target of targets) {
    const raw = cleave ? Math.max(1, Math.round(atk * 0.6)) : atk;
    const def = Math.max(0, target.def + target.defBuff - enemy.pierce);
    const after = Math.max(0, raw - def);
    if (after <= 0) {
      log(run, `${target.name} shrugs off ${enemy.name}.`);
      events.push({ floater: { key: `hero:${target.id}`, text: "0", kind: "miss" }, sfx: "block" });
      continue;
    }
    const beforeHp = target.hp;
    if (soakMinion(run, target, after, events)) {
      log(run, `${enemy.name} strikes a thrall instead of ${target.name}.`);
      continue;
    }
    hurtHero(run, target, after, events, false);
    const lost = beforeHp - Math.max(0, target.hp);
    log(run, lost > 0 ? `${enemy.name} strikes ${target.name} for ${lost}.` : `${enemy.name}'s strike glances off ${target.name}.`);
    if (enemy.poisonOnHit && target.hp > 0 && !target.down && beforeHp > target.hp) {
      target.poison += enemy.poisonOnHit;
      log(run, `${target.name} is poisoned (${target.poison}).`);
      events.push({ sfx: "poison" });
    }
  }
}

function rawHit(hero: HeroState, bonus: number, extra: number): number {
  return hero.atk + hero.atkBuff + bonus + extra;
}

function applyHitTo(run: Run, hero: HeroState, enemy: EnemyState, raw: number, events: GameEvent[], splash: boolean) {
  if (raw <= 0 || enemy.hp <= 0) return;
  const build = relicBuild(hero, run);
  const dealt = damageEnemy(run, enemy, raw, true, events, `${hero.name} hits ${enemy.name} for {d}.`);
  if (dealt > 0 && build.lifesteal && !hero.down) healHero(hero, build.lifesteal, events);
  if (dealt > 0 && build.poisonOnHit && enemy.hp > 0) {
    enemy.poison += build.poisonOnHit;
    log(run, `${enemy.name} is poisoned (${enemy.poison}).`);
  }
  if (dealt > 0 && build.bleedOnHit && enemy.hp > 0) {
    enemy.bleed = (enemy.bleed || 0) + build.bleedOnHit;
    log(run, `${enemy.name} is bleeding (${enemy.bleed}).`);
    events.push({ floater: { key: `enemy:${enemy.uid}`, text: `B${enemy.bleed}`, kind: "buff" } });
  }
  if (dealt > 0 && build.manaOnHit) gainMana(hero, build.manaOnHit, events);
  if (splash && build.splash) {
    for (const other of livingEnemies(run)) {
      if (other.uid === enemy.uid) continue;
      damageEnemy(run, other, build.splash, false, events, `Splinters catch ${other.name} for {d}.`);
    }
  }
}

function resolveEffects(run: Run, hero: HeroState, effects: Effect[], targetId: string | null, events: GameEvent[], exhaustHand: HandCard[]) {
  const foe = enemyById(run, targetId);
  const ally = heroById(run, targetId);
  for (const effect of effects) {
    if (effect.op === "wound") {
      const loss = Math.min(effect.amount, Math.max(0, hero.hp - 1));
      if (loss > 0) {
        hero.hp -= loss;
        log(run, `${hero.name} pays ${loss} health.`);
        events.push({ floater: { key: `hero:${hero.id}`, text: `−${loss}`, kind: "dmg" }, sfx: "hit" });
      }
    } else if (effect.op === "hit") {
      const hits = effect.hits ?? 1;
      const targets = effect.all ? livingEnemies(run).slice() : foe ? [foe] : [];
      for (const enemy of targets) {
        if (enemy.hp <= 0) continue;
        let extra = 0;
        if (effect.smite && enemy.hp * 2 <= enemy.maxHp) extra += 4;
        if (effect.openingBonus && enemy.hp / enemy.maxHp > 0.8) extra += effect.openingBonus;
        const raw = rawHit(hero, effect.bonus, extra);
        for (let i = 0; i < hits; i++) {
          if (enemy.hp <= 0) break;
          applyHitTo(run, hero, enemy, raw, events, !effect.all);
        }
      }
    } else if (effect.op === "flat") {
      const targets = effect.all ? livingEnemies(run).slice() : foe ? [foe] : [];
      for (const enemy of targets) damageEnemy(run, enemy, effect.amount, false, events);
    } else if (effect.op === "block") {
      continue;
    } else if (effect.op === "heal") {
      if (effect.self) healHero(hero, effect.amount, events);
      else if (effect.all) for (const t of livingHeroes(run)) healHero(t, effect.amount, events);
      else if (ally && !ally.down) healHero(ally, effect.amount, events);
    } else if (effect.op === "atk") {
      const targets = effect.all ? livingHeroes(run) : ally && !ally.down ? [ally] : [hero];
      for (const t of targets) {
        t.atkBuff += effect.amount;
        log(run, `${t.name} gains +${effect.amount} Attack.`);
        events.push({ floater: { key: `hero:${t.id}`, text: `+${effect.amount} ATK`, kind: "buff" }, sfx: "ui" });
      }
    } else if (effect.op === "def") {
      const targets = effect.all ? livingHeroes(run) : ally && !ally.down ? [ally] : [hero];
      for (const t of targets) {
        t.defBuff += effect.amount;
        log(run, `${t.name} gains +${effect.amount} Defense.`);
        events.push({ floater: { key: `hero:${t.id}`, text: `+${effect.amount} DEF`, kind: "buff" } });
      }
    } else if (effect.op === "weaken" && foe && foe.hp > 0) {
      const next = Math.min(WEAKEN_CAP, foe.weaken + effect.amount);
      const gained = next - foe.weaken;
      foe.weaken = next;
      if (gained > 0) {
        log(run, `${foe.name} is weakened (−${gained} Attack).`);
        events.push({ floater: { key: `enemy:${foe.uid}`, text: `−${gained} ATK`, kind: "buff" } });
      } else {
        log(run, `${foe.name} cannot be weakened further.`);
      }
    } else if (effect.op === "poison" && foe && foe.hp > 0) {
      foe.poison += effect.amount;
      log(run, `${foe.name} is poisoned (${foe.poison}).`);
      events.push({ sfx: "poison", floater: { key: `enemy:${foe.uid}`, text: `P${foe.poison}`, kind: "buff" } });
    } else if (effect.op === "taunt") {
      run.tauntHeroId = hero.id;
      log(run, `${hero.name} demands every blow.`);
    } else if (effect.op === "skip" && foe && foe.hp > 0) {
      foe.skip = true;
      log(run, `${foe.name} will skip its next action.`);
    } else if (effect.op === "exhaust") {
      const count = exhaustHand.filter((c) => c.cardId !== "basic-strike").length;
      const block = effect.base + effect.each * count;
      log(run, `${hero.name} exhausts ${count} card${count === 1 ? "" : "s"}.`);
      giveBlock(run, hero, block, events);
    } else if (effect.op === "cleanse") {
      const t = ally ?? hero;
      if (t.poison > 0) {
        t.poison = 0;
        log(run, `${t.name} is cleansed.`);
      }
    } else if (effect.op === "revive") {
      const t = ally;
      if (!t) continue;
      if (t.down) {
        t.down = false;
        t.hp = Math.min(t.maxHp, effect.amount);
        log(run, `${t.name} rises with ${t.hp} health.`);
        events.push({ sfx: "heal", banner: `${t.name} rises.`, floater: { key: `hero:${t.id}`, text: `+${t.hp}`, kind: "heal" } });
      } else healHero(t, effect.amount, events);
    } else if (effect.op === "extra") {
      const t = ally && !ally.down ? ally : hero;
      t.extraPlay = true;
      log(run, `${t.name} will play an extra card this round.`);
      events.push({ floater: { key: `hero:${t.id}`, text: "+card", kind: "buff" }, sfx: "ui" });
    } else if (effect.op === "mana") {
      const targets = ally ? [ally] : [hero];
      for (const t of targets) {
        if (t.down || t.maxMana <= 0) {
          log(run, `${t.name} has no mana to restore.`);
          continue;
        }
        const before = t.mana;
        t.mana = Math.min(t.maxMana, t.mana + effect.amount);
        const gained = t.mana - before;
        if (gained > 0) {
          log(run, `${t.name} recovers ${gained} mana.`);
          events.push({ sfx: "heal", floater: { key: `hero:${t.id}`, text: `+${gained} mana`, kind: "buff" } });
        }
      }
    } else if (effect.op === "summon") {
      raiseMinion(run, hero, effect.name, effect.hp, effect.atk, events);
    } else if (effect.op === "minion-strike") {
      minionsAct(run, hero, events);
    } else if (effect.op === "free-spell") {
      if (!hero.freeSpellUsed) {
        hero.freeSpell = true;
        log(run, `${hero.name} prepares a free spell.`);
        events.push({ sfx: "heal", floater: { key: `hero:${hero.id}`, text: "Rite", kind: "buff" } });
      }
    } else if (effect.op === "grudge") {
      const build = relicBuild(hero, run);
      const blow = hero.stored || 0;
      if (foe && foe.hp > 0 && blow > 0) {
        damageEnemy(run, foe, blow, false, events, `${hero.name} releases the grudge into ${foe.name} for {d}.`);
        if ((build.grudgeHeal ?? 0) > 0) healHero(hero, build.grudgeHeal, events);
        hero.stored = 0;
        log(run, `${hero.name} empties the plate.`);
      }
    }
  }
}

function applyBlocks(
  run: Run,
  hero: HeroState,
  effects: Effect[],
  targetId: string | null,
  events: GameEvent[],
) {
  const ally = heroById(run, targetId);
  for (const effect of effects) {
    if (effect.op !== "block") continue;
    if (effect.all) {
      for (const t of livingHeroes(run)) giveBlock(run, t, effect.amount, events);
    } else {
      const t = ally && !ally.down ? ally : hero;
      giveBlock(run, t, effect.amount, events);
    }
  }
}

function needsEnemy(effects: Effect[]): boolean {
  return effects.some((e) => e.op === "hit" && !e.all || e.op === "flat" && !e.all || e.op === "weaken" || e.op === "poison" || e.op === "skip");
}

function cardNeedsTarget(target: string, effects: Effect[]): boolean {
  if (target === "enemy" || target === "ally" || target === "any-hero") return true;
  return needsEnemy(effects);
}

export function cardPowerLabel(hero: { atk: number; atkBuff: number }, cardId: string): string | null {
  const card = CARDS[cardId] ?? SUPPLIES[cardId];
  if (!card) return null;
  const hit = card.effects.find((e) => e.op === "hit");
  if (hit && hit.op === "hit") {
    const base = Math.max(0, hero.atk + hero.atkBuff + hit.bonus);
    const high = base + (hit.smite ? 4 : 0) + (hit.openingBonus ?? 0);
    const hits = hit.hits ?? 1;
    const body = hit.smite || hit.openingBonus ? `${base}–${high}` : `${base}`;
    if (hit.all) return `${body} each`;
    if (hits > 1) return `${body} × ${hits}`;
    return body;
  }
  const flat = card.effects.find((e) => e.op === "flat");
  if (flat && flat.op === "flat") return flat.all ? `${flat.amount} each` : `${flat.amount}`;
  const block = card.effects.find((e) => e.op === "block");
  if (block && block.op === "block" && card.effects.every((e) => e.op === "block" || e.op === "taunt")) {
    return block.all ? `${block.amount} all` : `${block.amount}`;
  }
  const heal = card.effects.find((e) => e.op === "heal");
  if (heal && heal.op === "heal" && !card.effects.some((e) => e.op === "hit")) {
    return heal.all ? `+${heal.amount} all` : `+${heal.amount}`;
  }
  return null;
}

function discardHand(hero: HeroState, hand: HandCard[], playedUid: string, exhausted: boolean) {
  for (const c of hand) {
    if (c.cardId === "basic-strike") continue;
    if (c.uid === playedUid) {
      hero.discard.push(c.cardId);
      continue;
    }
    if (exhausted) hero.exhaust.push(c.cardId);
    else hero.discard.push(c.cardId);
  }
}

function raiseMinion(run: Run, hero: HeroState, name: string, hp: number, atk: number, events: GameEvent[]) {
  if (!run.minions) run.minions = [];
  const mine = run.minions.filter((m) => m.ownerId === hero.id && m.hp > 0);
  if (mine.length >= 2) {
    const weakest = mine.slice().sort((a, b) => a.hp - b.hp)[0]!;
    weakest.hp = weakest.maxHp;
    log(run, `${weakest.name} is knit back together.`);
    events.push({ sfx: "heal", floater: { key: `minion:${weakest.uid}`, text: "Rise", kind: "heal" } });
    return;
  }
  const minion = { uid: nextUid(run, "m"), ownerId: hero.id, name, hp, maxHp: hp, atk };
  run.minions.push(minion);
  log(run, `${hero.name} raises ${name}.`);
  events.push({ sfx: "card", floater: { key: `hero:${hero.id}`, text: "Rise", kind: "buff" }, banner: `${name} rises.` });
  const foes = livingEnemies(run);
  if (foes.length > 0) {
    const foe = foes[Math.floor(roll(run) * foes.length)]!;
    damageEnemy(run, foe, atk, false, events, `${name} strikes ${foe.name} for {d}.`);
  }
}

function minionsAct(run: Run, hero: HeroState, events: GameEvent[]) {
  const mine = (run.minions ?? []).filter((m) => m.ownerId === hero.id && m.hp > 0);
  for (const minion of mine) {
    const foes = livingEnemies(run);
    if (foes.length === 0) break;
    const foe = foes[Math.floor(roll(run) * foes.length)]!;
    damageEnemy(run, foe, minion.atk, false, events, `${minion.name} strikes ${foe.name} for {d}.`);
  }
}

function soakMinion(run: Run, hero: HeroState, amount: number, events: GameEvent[]): boolean {
  const mine = (run.minions ?? []).filter((m) => m.ownerId === hero.id && m.hp > 0);
  if (mine.length === 0 || roll(run) > 0.5) return false;
  const minion = mine[0]!;
  minion.hp -= amount;
  events.push({ sfx: "hit", floater: { key: `minion:${minion.uid}`, text: `−${amount}`, kind: "dmg" } });
  if (minion.hp <= 0) {
    minion.hp = 0;
    log(run, `${minion.name} crumbles.`);
  }
  return true;
}

function minionsMayClear(run: Run, events: GameEvent[]): boolean {
  if (run.enemies.length === 0 || livingEnemies(run).length > 0) return false;
  grantPartyXp(run, 4, events);
  log(run, "The fight breaks.");
  roomCleared(run, events);
  return true;
}

function startActor(run: Run, index: number, events: GameEvent[]) {
  const hero = run.party[index];
  if (!hero) return;
  const extra = hero.extraPlay ? 1 : 0;
  hero.extraPlay = false;
  run.actorIndex = index;
  run.playsLeft = 1 + extra;
  run.phase = "battle";
  dealHand(run, hero);
  minionsAct(run, hero, events);
  minionsMayClear(run, events);
}

function beginRoundBattle(run: Run, events: GameEvent[]) {
  const idx = run.party.findIndex((h) => !h.down && h.hp > 0);
  if (idx < 0) return;
  startActor(run, idx, events);
}

function enterEnemyPhase(run: Run) {
  run.phase = "enemy";
  run.beat = "bleed";
  run.strikeIndex = 0;
  run.strikeHitsLeft = 0;
  run.hand = [];
  for (const e of run.enemies) {
    e.poisonTicked = false;
    e.bleedTicked = false;
  }
  for (const h of run.party) h.poisonTicked = false;
}

function awardGold(run: Run, events: GameEvent[]) {
  if (run.enemies.length === 0) return;
  let purse = run.depth * 2;
  for (const enemy of run.enemies) {
    if (enemy.final) purse += 55;
    else if (enemy.boss) purse += 36;
    else if (enemy.tier === "elite") purse += 18;
    else if (enemy.tier === "standard") purse += 10;
    else purse += 6;
  }
  run.gold += purse;
  const line = `The fallen leave ${purse} gold. You hold ${run.gold}.`;
  log(run, line);
  events.push({ banner: `+${purse} gold` });
}

function roomCleared(run: Run, events: GameEvent[]) {
  awardGold(run, events);
  stashMonsters(run);
  run.enemies = [];
  run.hand = [];
  run.tauntHeroId = null;
  run.minions = [];
  if (run.activeDoor) events.push({ doorDone: run.activeDoor.kind });
  for (const h of run.party) {
    h.block = 0;
    h.braced = false;
    h.freeSpell = false;
    h.freeSpellUsed = false;
  }
  const odds = run.activeDoor?.odds;
  if (!odds) {
    run.phase = run.finalSlain ? "onward" : "onward";
    run.clearedNote = "The room stills.";
    return;
  }
  run.offer = rollOffer(run, odds, 3);
  run.pendingRelic = null;
  if (run.offer.length === 0) {
    run.phase = "onward";
    run.clearedNote = "The hoard was already picked clean.";
    log(run, run.clearedNote);
    return;
  }
  run.phase = "treasure";
  run.clearedNote = "Choose one relic.";
  events.push({ sfx: "card" });
}

function finishIfWiped(run: Run): "defeat" | null {
  if (livingHeroes(run).length === 0) return "defeat";
  return null;
}

function endOfEnemyPhase(run: Run, events: GameEvent[]): StepResult {
  const wiped = finishIfWiped(run);
  if (wiped) return { run, events, outcome: "defeat" };
  const won = maybeWonRoom(run, events);
  if (won) return won;
  for (const h of run.party) {
    h.block = 0;
    h.braced = false;
  }
  run.tauntHeroId = null;
  run.round += 1;
  run.prepSupplyUsed = false;
  run.phase = "prep";
  run.hand = [];
  let restored = 0;
  for (const hero of run.party) {
    if (hero.down || hero.maxMana <= 0 || hero.mana >= hero.maxMana) continue;
    hero.mana += 1;
    restored += 1;
    events.push({ floater: { key: `hero:${hero.id}`, text: "+1 mana", kind: "buff" } });
  }
  log(run, restored > 0 ? `Round ${run.round}. The ley returns a little mana.` : `Round ${run.round}.`);
  if (run.round > 20) {
    log(run, `The hall grows cruel. Foes hit ${run.round - 20} harder.`);
  }
  return { run, events };
}

function partyScale(run: Run, base: number, kind: "hp" | "atk"): number {
  const party = run.party.length;
  const avg = run.party.reduce((s, h) => s + h.level, 0) / Math.max(1, party);
  return scaleNumber(base, party, run.depth, avg, kind);
}

function tryAscend(run: Run, enemy: EnemyState, events: GameEvent[]): boolean {
  if (!enemy.boss || enemy.form >= enemy.forms) return false;
  const shift = MONSTERS[enemy.defId]?.shifts?.[enemy.form - 1];
  if (!shift) return false;
  enemy.form += 1;
  enemy.formName = shift.form;
  enemy.maxHp += partyScale(run, shift.hp, "hp");
  enemy.hp = enemy.maxHp;
  enemy.baseAtk += partyScale(run, shift.atk, "atk");
  enemy.atk = enemy.baseAtk;
  enemy.armor += shift.armor;
  enemy.pierce += shift.pierce ?? 0;
  if (shift.poisonOnHit) enemy.poisonOnHit = Math.max(enemy.poisonOnHit, shift.poisonOnHit);
  if (shift.rageCleave) enemy.rageCleave = true;
  if (shift.rageDouble) enemy.rageDouble = true;
  if (shift.alwaysCleave) enemy.alwaysCleave = true;
  if (shift.alwaysDouble) enemy.alwaysDouble = true;
  if (shift.rageBonus) enemy.rageBonus += shift.rageBonus;
  enemy.raging = false;
  enemy.halfEnraged = false;
  enemy.poison = 0;
  enemy.bleed = 0;
  enemy.bleedTicked = false;
  enemy.skip = false;
  enemy.blurb = shift.line;
  const banner = `${enemy.name} returns at full health — ${shift.form}.`;
  log(run, `${banner} ${shift.line}`);
  events.push({
    banner,
    sfx: "rage",
    shake: true,
    floater: { key: `enemy:${enemy.uid}`, text: shift.form, kind: "buff" },
  });
  return true;
}

function scaleNumber(base: number, party: number, depth: number, avgLevel: number, kind: "hp" | "atk"): number {
  const hpM = [0, 1, 1.75, 2.45, 3.05][party] ?? 1;
  const atkM = [0, 1, 1.12, 1.22, 1.32][party] ?? 1;
  const depthM = kind === "hp" ? 1 + (depth - 1) * 0.07 : 1 + (depth - 1) * 0.04;
  const lvlM = 1 + Math.max(0, avgLevel - 1) * (kind === "hp" ? 0.04 : 0.025);
  return Math.max(1, Math.round(base * (kind === "hp" ? hpM : atkM) * depthM * lvlM));
}

function spawn(run: Run, defId: string): EnemyState {
  const def = MONSTERS[defId];
  const party = run.party.length;
  const avg = run.party.reduce((s, h) => s + h.level, 0) / Math.max(1, party);
  const boss = def.tier === "boss" || def.tier === "final";
  const atk = scaleNumber(def.atk, party, run.depth, avg, "atk");
  const hp = scaleNumber(def.hp, party, run.depth, avg, "hp");
  return {
    uid: nextUid(run, "e"),
    defId,
    name: def.name,
    blurb: def.blurb,
    hp,
    maxHp: hp,
    atk,
    armor: def.armor,
    xp: def.xp,
    tier: def.tier,
    poison: 0,
    bleed: 0,
    weaken: 0,
    skip: false,
    raging: false,
    halfEnraged: false,
    poisonTicked: false,
    bleedTicked: false,
    poisonOnHit: def.poisonOnHit ?? 0,
    pierce: def.pierce ?? 0,
    enrageAtHalf: def.enrageAtHalf ?? 0,
    rageAt: def.rageAt ?? 0,
    rageBonus: def.rageBonus ?? 0,
    rageCleave: Boolean(def.rageCleave),
    rageDouble: Boolean(def.rageDouble),
    form: 1,
    forms: def.phases ?? 1,
    formName: "",
    baseAtk: atk,
    alwaysCleave: false,
    alwaysDouble: false,
    boss,
    final: def.tier === "final",
  };
}

function drawMonster(run: Run, tier: "weak" | "standard" | "elite"): string {
  const rnd = () => roll(run);
  if (tier === "weak") {
    const got = pull(run.weakDeck, run.weakDiscard, rnd);
    run.weakDeck = got.deck;
    run.weakDiscard = got.discard;
    return got.id ?? "goblin";
  }
  if (tier === "elite") {
    const got = pull(run.eliteDeck, run.eliteDiscard, rnd);
    run.eliteDeck = got.deck;
    run.eliteDiscard = got.discard;
    return got.id ?? "ogre";
  }
  const got = pull(run.standardDeck, run.standardDiscard, rnd);
  run.standardDeck = got.deck;
  run.standardDiscard = got.discard;
  return got.id ?? "cultist";
}

function stashMonsters(run: Run) {
  for (const e of run.enemies) {
    if (e.tier === "weak") run.weakDiscard.push(e.defId);
    else if (e.tier === "standard") run.standardDiscard.push(e.defId);
    else if (e.tier === "elite") run.eliteDiscard.push(e.defId);
  }
}

function buildFight(run: Run, door: DoorState) {
  const plan = foePlan(door.kind, run.party.length);
  const enemies: EnemyState[] = [];
  if (door.kind === "miniboss" && door.bossId) {
    enemies.push(spawn(run, door.bossId));
    for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
  } else if (door.kind === "final") {
    enemies.push(spawn(run, "king"));
    for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "standard")));
  } else if (door.kind === "ambush") {
    enemies.push(spawn(run, drawMonster(run, "elite")));
    for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
  } else if (door.kind === "quiet" || door.kind === "nest") {
    for (let i = 0; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
  } else if (door.kind === "vault") {
    for (let i = 0; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, i === 0 ? "standard" : "weak")));
  }
  run.enemies = enemies;
}

function openCombat(run: Run, events: GameEvent[]) {
  run.round = 1;
  run.prepSupplyUsed = false;
  run.tauntHeroId = null;
  for (const h of run.party) {
    if (h.exhaust.length) {
      h.deck = shuffle([...h.deck, ...h.exhaust], () => roll(run));
      h.exhaust = [];
    }
    h.block = 0;
    h.atkBuff = 0;
    h.defBuff = 0;
    h.poison = 0;
    h.braced = false;
    h.extraPlay = false;
    h.deathWardUsed = false;
    h.poisonTicked = false;
    h.freeSpell = false;
    h.freeSpellUsed = false;
    const block = relicBuild(h, run).startBlock;
    if (block > 0 && !h.down) giveBlock(run, h, block, events);
  }
  run.phase = "prep";
  const names = run.enemies.map((e) => e.name).join(", ");
  const phased = run.enemies.find((e) => e.boss && e.forms > 1);
  run.intro = phased
    ? `${run.activeDoor?.title ?? "The hall"} — ${names}. ${phased.forms} forms. Relics from the halls are how you last.`
    : `${run.activeDoor?.title ?? "The hall"} opens onto ${names}.`;
  log(run, run.intro);
}

function rollRarity(odds: { common: number; rare: number; mythic: number }, rnd: number): Rarity {
  if (rnd * 100 < odds.mythic) return "mythic";
  if (rnd * 100 < odds.mythic + odds.rare) return "rare";
  return "common";
}

function drawRelic(run: Run, rarity: Rarity, allowMythic: boolean): string | null {
  const order: Rarity[] = [];
  const push = (key: Rarity) => {
    if (!allowMythic && key === "mythic") return;
    if (!order.includes(key)) order.push(key);
  };
  push(rarity === "mythic" && !allowMythic ? "rare" : rarity);
  push("rare");
  push("common");
  if (allowMythic) push("mythic");
  const rnd = () => roll(run);
  for (const key of order) {
    const got = pull(run.treasures[key], run.treasureDiscard[key], rnd);
    run.treasures[key] = got.deck;
    run.treasureDiscard[key] = got.discard;
    if (got.id) return got.id;
  }
  return null;
}

function partyCanWear(run: Run, relicId: string): boolean {
  const rel = RELICS[relicId];
  if (!rel?.classes?.length) return true;
  return run.party.some((h) => rel.classes!.includes(h.classId));
}

function grantIds(): Set<string> {
  const ids = new Set<string>();
  for (const relic of Object.values(RELICS)) {
    for (const cardId of relic.grantCards ?? []) ids.add(cardId);
  }
  return ids;
}

function syncGrants(hero: HeroState, run: Run) {
  const grants = grantIds();
  const want = new Set<string>();
  for (const id of relicIdsOf(hero.keepsakeId, run.equipped[hero.id] ?? [])) {
    for (const cardId of RELICS[id]?.grantCards ?? []) want.add(cardId);
  }
  const drop = (id: string) => grants.has(id) && !want.has(id);
  hero.deck = hero.deck.filter((id) => !drop(id));
  hero.discard = hero.discard.filter((id) => !drop(id));
  hero.exhaust = hero.exhaust.filter((id) => !drop(id));
  const acting = run.party[run.actorIndex]?.id === hero.id;
  if (acting) run.hand = run.hand.filter((c) => !drop(c.cardId));
  const have = new Set([
    ...hero.deck,
    ...hero.discard,
    ...hero.exhaust,
    ...(acting ? run.hand.map((c) => c.cardId) : []),
  ]);
  for (const id of want) {
    if (!have.has(id)) hero.deck.push(id);
  }
}

function takeRelic(run: Run, rarity: Rarity, allowMythic: boolean): string | null {
  for (let i = 0; i < 6; i++) {
    const id = drawRelic(run, rarity, allowMythic);
    if (!id) return null;
    if (partyCanWear(run, id)) return id;
    const rel = RELICS[id];
    if (rel) run.treasureDiscard[rel.rarity].push(id);
  }
  return null;
}

function rollOffer(run: Run, odds: { common: number; rare: number; mythic: number }, n: number) {
  const offer = [];
  const seen = new Set<string>();
  for (let i = 0; i < n + 4 && offer.length < n; i++) {
    const rarity = rollRarity(odds, roll(run));
    const id = takeRelic(run, rarity, odds.mythic > 0);
    if (!id || seen.has(id)) {
      if (id) {
        const rel = RELICS[id];
        run.treasureDiscard[rel.rarity].push(id);
      }
      continue;
    }
    seen.add(id);
    offer.push({ uid: nextUid(run, "o"), defId: id });
  }
  return offer;
}

function makeDoor(run: Run, kind: DoorKind, bossId?: string): DoorState {
  if (kind === "miniboss") {
    const hint = BOSS_DOOR.hints[Math.floor(roll(run) * BOSS_DOOR.hints.length)] ?? BOSS_DOOR.hints[0]!;
    const boss = bossId ? MONSTERS[bossId] : undefined;
    return {
      uid: nextUid(run, "d"),
      kind,
      title: boss ? `Seal — ${boss.name}` : BOSS_DOOR.title,
      hint,
      risk: BOSS_DOOR.risk,
      lootLabel: BOSS_DOOR.lootLabel,
      foes: foePlan(kind, run.party.length).label,
      odds: BOSS_DOOR.odds,
      bossId,
    };
  }
  if (kind === "final") {
    return {
      uid: nextUid(run, "d"),
      kind,
      title: FINAL_DOOR.title,
      hint: FINAL_DOOR.hints[0]!,
      risk: FINAL_DOOR.risk,
      lootLabel: FINAL_DOOR.lootLabel,
      foes: foePlan(kind, run.party.length).label,
      odds: FINAL_DOOR.odds,
      bossId: "king",
    };
  }
  const tpl = DOOR_TEMPLATES[kind];
  const hint = tpl.hints[Math.floor(roll(run) * tpl.hints.length)] ?? tpl.hints[0]!;
  return {
    uid: nextUid(run, "d"),
    kind,
    title: tpl.title,
    hint,
    risk: tpl.risk,
    lootLabel: tpl.lootLabel,
    foes: foePlan(kind, run.party.length).label,
    odds: tpl.odds,
  };
}

function generateDoors(run: Run) {
  const rnd = () => roll(run);
  if (run.seals >= 3) {
    const doors = [makeDoor(run, "final")];
    if (!run.cacheTaken) doors.push(makeDoor(run, "supplies"));
    if (roll(run) < 0.55) doors.push(makeDoor(run, "shop"));
    run.doors = doors;
    run.phase = "doors";
    run.intro = run.cacheTaken
      ? "Only the Hollow Gate remains."
      : "The Hollow Gate is the only way forward. A side cache remains, if you want one more breath.";
    if (doors.some((d) => d.kind === "shop")) run.intro += " A stall waits beside it.";
    return;
  }
  const bag: DoorKind[] = ["quiet", "vault", "ambush", "nest", "supplies", "curse", "font", "shop", "shop", "shop"];
  const want = run.depth === 1 ? 3 : 2;
  const picked: DoorKind[] = [];
  for (const kind of shuffle(bag, rnd)) {
    if (picked.includes(kind)) continue;
    picked.push(kind);
    if (picked.length >= want) break;
  }
  const doors = picked.map((k) => makeDoor(run, k));
  if (run.depth >= 2 && run.seals < 3) {
    const bossId = run.bossOrder[run.seals];
    doors.push(makeDoor(run, "miniboss", bossId));
  }
  while (doors.length < 3) doors.push(makeDoor(run, doors.some((d) => d.kind === "quiet") ? "nest" : "quiet"));
  if (roll(run) < 0.42) {
    const extra = makeDoor(run, "shop");
    if (doors.some((d) => d.kind === "shop")) {
      extra.title = "Side Stall";
      extra.hint = "A second lamp, and a merchant who already knows your coin.";
      extra.lootLabel = "Another stall. Same gold.";
    }
    doors.push(extra);
  }
  run.doors = shuffle(doors, rnd);
  run.phase = "doors";
  run.activeDoor = null;
  const stalls = run.doors.filter((d) => d.kind === "shop").length;
  if (run.depth === 1) {
    run.intro =
      stalls > 1
        ? "Three ways down, and more than one stall."
        : stalls === 1
          ? "Three ways down. A stall has set up among them."
          : "Three ways down. The seals are deeper.";
  } else {
    run.intro = `Depth ${run.depth}. Seals ${run.seals}/3.${stalls ? " A stall is open." : ""}`;
  }
}

function curseDamage(run: Run, events: GameEvent[]) {
  for (const hero of livingHeroes(run)) {
    const raw = Math.max(2, 7 - (hero.def + hero.defBuff));
    const loss = Math.min(raw, Math.max(0, hero.hp - 1));
    if (loss <= 0) {
      log(run, `${hero.name} is barely nicked.`);
      continue;
    }
    hero.hp -= loss;
    log(run, `The trap bites ${hero.name} for ${loss}.`);
    events.push({ sfx: "hit", floater: { key: `hero:${hero.id}`, text: `−${loss}`, kind: "dmg" }, shake: true });
  }
}

export function startRun(roster: PersistedHero[], partyIds: string[], seed?: number): Run {
  const ids = partyIds.filter((id) => roster.some((h) => h.id === id && h.unlocked)).slice(0, 4);
  const seedState = (seed ?? ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0)) >>> 0;
  const run = {
    rng: seedState || 1,
    depth: 1,
    seals: 0,
    phase: "doors",
    beat: "poison",
    strikeIndex: 0,
    strikeHitsLeft: 0,
    doors: [],
    activeDoor: null,
    intro: "",
    party: [],
    enemies: [],
    minions: [],
    hand: [],
    actorIndex: 0,
    playsLeft: 1,
    round: 1,
    tauntHeroId: null,
    prepSupplyUsed: false,
    supplies: [],
    gold: 0,
    shop: [],
    afterEquip: null,
    supplyDeck: [],
    supplyDiscard: [],
    weakDeck: [],
    weakDiscard: [],
    standardDeck: [],
    standardDiscard: [],
    eliteDeck: [],
    eliteDiscard: [],
    treasures: { common: [], rare: [], mythic: [] },
    treasureDiscard: { common: [], rare: [], mythic: [] },
    bossOrder: [],
    equipped: {},
    locker: [],
    offer: [],
    pendingRelic: null,
    log: [],
    xpGained: {},
    levelStart: {},
    lowHpBossKill: false,
    finalSlain: false,
    bossesSlain: [],
    uid: 1,
    clock: 0,
    cacheTaken: false,
    clearedNote: "",
  } as Run;
  const rnd = () => roll(run);
  run.supplyDeck = shuffle(SUPPLY_DECK, rnd);
  run.weakDeck = shuffle(WEAK_DECK, rnd);
  run.standardDeck = shuffle(STANDARD_DECK, rnd);
  run.eliteDeck = shuffle(ELITE_DECK, rnd);
  run.treasures = {
    common: shuffle(TREASURE_DECKS.common, rnd),
    rare: shuffle(TREASURE_DECKS.rare, rnd),
    mythic: shuffle(TREASURE_DECKS.mythic, rnd),
  };
  run.bossOrder = shuffle(MINIBOSS_IDS, rnd);
  run.party = ids.map((id, seat) => {
    const src = roster.find((h) => h.id === id)!;
    const cls = CLASSES[id];
    const stats = computeStats(id, src.level, relicIdsOf(src.keepsakeId, []));
    run.equipped[id] = [];
    run.levelStart[id] = src.level;
    run.xpGained[id] = 0;
    return {
      id,
      name: src.name || cls.heroName,
      classId: id,
      seat,
      level: src.level,
      xp: src.xp,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      atk: stats.atk,
      def: stats.def,
      keepsakeId: src.keepsakeId,
      block: 0,
      atkBuff: 0,
      defBuff: 0,
      poison: 0,
      down: false,
      braced: false,
      extraPlay: false,
      deathWardUsed: false,
      poisonTicked: false,
      deck: shuffle(deckFor(id, src.level), rnd),
      discard: [],
      exhaust: [],
      mana: CLASSES[id]?.mana ?? 0,
      maxMana: CLASSES[id]?.mana ?? 0,
      freeSpell: false,
      freeSpellUsed: false,
      stored: 0,
    } satisfies HeroState;
  });
  const opening = drawIds(run.supplyDeck, run.supplyDiscard, 2, rnd);
  run.supplyDeck = opening.deck;
  run.supplyDiscard = opening.discard;
  run.supplies = opening.ids.map((defId) => ({ uid: nextUid(run, "s"), defId }));
  for (const hero of run.party) syncGrants(hero, run);
  log(run, "The guild steps under the first arch.");
  generateDoors(run);
  return run;
}

function maybeWonRoom(run: Run, events: GameEvent[]): StepResult | null {
  if (run.enemies.length === 0 || livingEnemies(run).length > 0) return null;
  grantPartyXp(run, 4, events);
  log(run, "The fight breaks.");
  roomCleared(run, events);
  if (run.finalSlain && run.phase === "onward") return { run, events, outcome: "victory" };
  return { run, events };
}

export function chooseDoor(prev: Run, doorUid: string): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "doors") return { run: prev, events };
  const door = run.doors.find((d) => d.uid === doorUid);
  if (!door) return { run: prev, events };
  run.activeDoor = door;
  events.push({ sfx: "door" });
  if (door.kind === "supplies") {
    if (run.seals >= 3) run.cacheTaken = true;
    const rnd = () => roll(run);
    const got = drawIds(run.supplyDeck, run.supplyDiscard, 2, rnd);
    run.supplyDeck = got.deck;
    run.supplyDiscard = got.discard;
    for (const id of got.ids) run.supplies.push({ uid: nextUid(run, "s"), defId: id });
    run.phase = "supply";
    run.intro = door.hint;
    log(run, `You find ${got.ids.map((id) => SUPPLIES[id]?.name ?? "a supply").join(" and ") || "nothing"}.`);
    grantPartyXp(run, 3, events);
    events.push({ sfx: "card", doorDone: "supplies" });
    return { run, events };
  }
  if (door.kind === "shop") {
    run.shop = stockShop(run);
    run.phase = "shop";
    run.intro = "The stallkeeper weighs your coin.";
    log(run, `A stall. You hold ${run.gold} gold.`);
    events.push({ sfx: "card", doorDone: "shop" });
    return { run, events };
  }
  if (door.kind === "font") {
    let restored = 0;
    for (const hero of run.party) {
      if (hero.down || hero.maxMana <= 0) continue;
      const before = hero.mana;
      hero.mana = Math.min(hero.maxMana, hero.mana + 3);
      restored += hero.mana - before;
    }
    const notes: string[] = [];
    notes.push(restored > 0 ? `The font restores ${restored} mana.` : "The font is still. No one here drinks from it.");
    if (run.supplies.length < POUCH_MAX) {
      run.supplies.push({ uid: nextUid(run, "s"), defId: "sup-mana" });
      notes.push("A Mana Phial sits on the basin.");
    }
    run.phase = "onward";
    run.clearedNote = notes.join(" ");
    log(run, run.clearedNote);
    grantPartyXp(run, 3, events);
    events.push({ sfx: "heal", banner: run.clearedNote, doorDone: "font" });
    return { run, events };
  }
  if (door.kind === "curse") {
    run.intro = "The reliquary bites before it pays.";
    curseDamage(run, events);
    run.phase = "curse";
    log(run, run.intro);
    return { run, events };
  }
  buildFight(run, door);
  openCombat(run, events);
  return maybeWonRoom(run, events) ?? { run, events };
}

export function brace(prev: Run, heroId: string): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "prep") return { run: prev, events };
  const hero = heroById(run, heroId);
  if (!hero || hero.down || hero.braced) return { run: prev, events };
  hero.braced = true;
  const amount = Math.max(0, hero.def + hero.defBuff);
  log(run, `${hero.name} braces.`);
  giveBlock(run, hero, amount, events);
  return maybeWonRoom(run, events) ?? { run, events };
}

export function useSupply(prev: Run, supplyUid: string, targetId: string | null): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "prep" || run.prepSupplyUsed) return { run: prev, events };
  const inst = run.supplies.find((s) => s.uid === supplyUid);
  if (!inst) return { run: prev, events };
  const def = SUPPLIES[inst.defId];
  if (!def) return { run: prev, events };
  if (def.target === "enemy") {
    const foe = enemyById(run, targetId);
    if (!foe || foe.hp <= 0) return { run: prev, events };
  } else if (def.target === "ally") {
    const ally = heroById(run, targetId);
    if (!ally || ally.down) return { run: prev, events };
  } else if (def.target === "any-hero") {
    if (!heroById(run, targetId)) return { run: prev, events };
  }
  if (def.effects.some((e) => e.op === "mana")) {
    const ally = heroById(run, targetId);
    if (!ally || ally.maxMana <= 0) {
      log(run, "That hero has no mana to restore.");
      return { run, events: [{ sfx: "ui", banner: "No mana to restore" }] };
    }
  }
  const actor = livingHeroes(run)[0] ?? run.party[0]!;
  log(run, `The party uses ${def.name}.`);
  const fakeHand: HandCard[] = [];
  resolveEffectsClean(run, actor, def.effects, targetId, events, fakeHand);
  run.supplies = run.supplies.filter((s) => s.uid !== supplyUid);
  run.supplyDiscard.push(inst.defId);
  run.prepSupplyUsed = true;
  events.push({ sfx: "card" });
  const wiped = finishIfWiped(run);
  if (wiped) return { run, events, outcome: "defeat" };
  return maybeWonRoom(run, events) ?? { run, events };
}

function resolveEffectsClean(
  run: Run,
  hero: HeroState,
  effects: Effect[],
  targetId: string | null,
  events: GameEvent[],
  exhaustHand: HandCard[],
) {
  const nonBlock = effects.filter((e) => e.op !== "block");
  resolveEffects(run, hero, nonBlock, targetId, events, exhaustHand);
  applyBlocks(run, hero, effects.filter((e) => e.op === "block"), targetId, events);
}

export function beginBattle(prev: Run): StepResult {
  const events: GameEvent[] = [];
  if (prev.phase !== "prep") return { run: prev, events };
  const run = clone(prev);
  if (livingHeroes(run).length === 0) return { run, events, outcome: "defeat" };
  beginRoundBattle(run, events);
  if (livingEnemies(run).length > 0) log(run, `${run.party[run.actorIndex]?.name ?? "A hero"}'s turn.`);
  events.push({ sfx: "card" });
  if (livingEnemies(run).length === 0 && run.finalSlain && run.phase !== "treasure") {
    return { run, events, outcome: "victory" };
  }
  return { run, events };
}

export function playCard(prev: Run, handUid: string, targetId: string | null): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "battle") return { run: prev, events };
  const hero = run.party[run.actorIndex];
  if (!hero || hero.down) return { run: prev, events };
  const handCard = run.hand.find((c) => c.uid === handUid);
  if (!handCard) return { run: prev, events };
  const def = CARDS[handCard.cardId];
  if (!def) return { run: prev, events };
  if (def.effects.some((e) => e.op === "grudge")) {
    const cap = relicBuild(hero, run).storeCap ?? 0;
    if (cap <= 0 || hero.stored < cap) {
      log(run, `${hero.name}'s grudge holds ${hero.stored}/${cap || 0}.`);
      return { run, events: [{ sfx: "ui", banner: cap > 0 ? `Grudge ${hero.stored}/${cap}` : "Nothing stored" }] };
    }
  }
  const armsRite = def.effects.some((e) => e.op === "free-spell");
  if (armsRite && (hero.freeSpellUsed || hero.freeSpell)) {
    log(run, hero.freeSpellUsed ? `${hero.name} already spent the rite this room.` : `${hero.name} already holds a free spell.`);
    return {
      run,
      events: [{ sfx: "ui", banner: hero.freeSpellUsed ? "Rite spent this room" : "A spell is already free" }],
    };
  }
  if (def.target === "enemy" || needsEnemy(def.effects)) {
    const foe = enemyById(run, targetId);
    if (!foe || foe.hp <= 0) return { run: prev, events };
  }
  if (def.target === "ally") {
    const ally = heroById(run, targetId);
    if (!ally || ally.down) return { run: prev, events };
  }
  const exhausts = def.effects.some((e) => e.op === "exhaust");
  const cost = def.mana ?? 0;
  const waived = cost > 0 && hero.freeSpell;
  if (cost > 0 && !waived && (hero.maxMana <= 0 || hero.mana < cost)) {
    log(run, `${hero.name} lacks the mana for ${def.name}.`);
    return { run, events: [{ sfx: "ui", banner: "Not enough mana" }] };
  }
  if (waived) {
    hero.freeSpell = false;
    hero.freeSpellUsed = true;
    log(run, `${hero.name}'s spell costs nothing.`);
    events.push({ floater: { key: `hero:${hero.id}`, text: "Free", kind: "buff" } });
  } else if (cost > 0) {
    hero.mana -= cost;
    events.push({ floater: { key: `hero:${hero.id}`, text: `−${cost} mana`, kind: "buff" } });
  }
  const others = run.hand.filter((c) => c.uid !== handCard.uid);
  log(run, `${hero.name} plays ${def.name}.`);
  resolveEffectsClean(run, hero, def.effects, targetId, events, others);
  discardHand(hero, run.hand, handCard.uid, exhausts);
  run.hand = [];
  events.push({ sfx: "card" });
  return afterPlay(run, events);
}

function nextActor(run: Run, events: GameEvent[]): StepResult {
  let next = run.actorIndex + 1;
  while (next < run.party.length && (run.party[next]!.down || run.party[next]!.hp <= 0)) next += 1;
  if (next >= run.party.length) {
    enterEnemyPhase(run);
    return { run, events };
  }
  startActor(run, next, events);
  if (run.phase !== "battle") return { run, events };
  log(run, `${run.party[next]!.name}'s turn.`);
  return { run, events };
}

function afterPlay(run: Run, events: GameEvent[]): StepResult {
  if (finishIfWiped(run)) return { run, events, outcome: "defeat" };
  const won = maybeWonRoom(run, events);
  if (won) return won;
  run.playsLeft -= 1;
  const hero = run.party[run.actorIndex];
  if (run.playsLeft > 0 && hero && !hero.down) {
    dealHand(run, hero);
    log(run, `${hero.name} plays again.`);
    return { run, events };
  }
  return nextActor(run, events);
}

export function endTurn(prev: Run): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "battle") return { run: prev, events };
  const hero = run.party[run.actorIndex];
  if (!hero || hero.down) return { run: prev, events };
  log(run, `${hero.name} ends the turn.`);
  discardHand(hero, run.hand, "", false);
  run.hand = [];
  run.playsLeft = 1;
  events.push({ sfx: "ui" });
  return afterPlay(run, events);
}

export function stepEnemies(prev: Run): StepResult {
  if (prev.phase !== "enemy") return { run: prev, events: [] };
  const run = clone(prev);
  run.clock += 1;
  const events: GameEvent[] = [];
  let guard = 0;
  while (guard++ < 8 && run.phase === "enemy") {
    if (run.beat === "bleed") {
      const foe = livingEnemies(run).find((e) => (e.bleed || 0) > 0 && !e.bleedTicked);
      if (!foe) {
        run.beat = "poison";
        continue;
      }
      foe.bleedTicked = true;
      const amt = foe.bleed;
      foe.bleed = Math.floor(foe.bleed / 2);
      damageEnemy(run, foe, amt, false, events, `Bleed weeps from ${foe.name} for {d}.`);
      events.push({ sfx: "hit" });
      if (livingEnemies(run).length === 0) return endOfEnemyPhase(run, events);
      return { run, events };
    }
    if (run.beat === "poison") {
      const foe = livingEnemies(run).find((e) => e.poison > 0 && !e.poisonTicked);
      if (!foe) {
        run.beat = "strikes";
        run.strikeIndex = 0;
        run.strikeHitsLeft = 0;
        continue;
      }
      foe.poisonTicked = true;
      const amt = foe.poison;
      foe.poison = Math.max(0, foe.poison - 1);
      damageEnemy(run, foe, amt, false, events, `Poison gnaws ${foe.name} for {d}.`);
      events.push({ sfx: "poison" });
      if (livingEnemies(run).length === 0) return endOfEnemyPhase(run, events);
      return { run, events };
    }
    if (run.beat === "strikes") {
      const foes = livingEnemies(run);
      if (run.strikeIndex >= foes.length) {
        run.beat = "hero-poison";
        continue;
      }
      const foe = foes[run.strikeIndex]!;
      if (foe.skip) {
        foe.skip = false;
        log(run, `${foe.name} loses its action in the smoke.`);
        run.strikeIndex += 1;
        run.strikeHitsLeft = 0;
        events.push({ sfx: "ui" });
        return { run, events };
      }
      const swings = foe.alwaysDouble || (foe.raging && foe.rageDouble) ? 2 : 1;
      if (run.strikeHitsLeft <= 0) run.strikeHitsLeft = swings;
      const living = livingHeroes(run);
      if (living.length === 0) return { run, events, outcome: "defeat" };
      let target = living[0]!;
      const taunt = living.find((h) => h.id === run.tauntHeroId);
      if (taunt) target = taunt;
      else {
        const weights = living.map((h) => 1.2 - h.hp / Math.max(1, h.maxHp));
        let r = roll(run) * weights.reduce((a, b) => a + b, 0);
        for (let i = 0; i < living.length; i++) {
          r -= weights[i]!;
          if (r <= 0) {
            target = living[i]!;
            break;
          }
        }
      }
      strikeHero(run, foe, target, events);
      run.strikeHitsLeft -= 1;
      if (run.strikeHitsLeft <= 0) run.strikeIndex += 1;
      if (livingHeroes(run).length === 0) return { run, events, outcome: "defeat" };
      return { run, events };
    }
    if (run.beat === "hero-poison") {
      const hero = run.party.find((h) => !h.down && h.hp > 0 && h.poison > 0 && !h.poisonTicked);
      if (!hero) {
        run.beat = "cleanup";
        continue;
      }
      hero.poisonTicked = true;
      const amt = hero.poison;
      hero.poison = Math.max(0, hero.poison - 1);
      log(run, `Poison ticks on ${hero.name} for ${amt}.`);
      hurtHero(run, hero, amt, events, true);
      events.push({ sfx: "poison" });
      if (livingHeroes(run).length === 0) return { run, events, outcome: "defeat" };
      return { run, events };
    }
    return endOfEnemyPhase(run, events);
  }
  return { run, events };
}

export function acknowledgeCurse(prev: Run): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "curse" || !run.activeDoor?.odds) return { run: prev, events };
  grantPartyXp(run, 4, events);
  run.offer = rollOffer(run, run.activeDoor.odds, 3);
  run.pendingRelic = null;
  run.phase = run.offer.length ? "treasure" : "onward";
  run.clearedNote = run.offer.length ? "The trap paid out. Choose one relic." : "Nothing inside but teeth.";
  return { run, events: [...events, { sfx: "card", doorDone: "curse" }] };
}

export function chooseRelic(prev: Run, offerUid: string | "none"): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "treasure") return { run: prev, events };
  if (offerUid === "none") {
    for (const o of run.offer) {
      const rel = RELICS[o.defId];
      if (rel) run.treasureDiscard[rel.rarity].push(o.defId);
    }
    run.offer = [];
    log(run, "The party leaves the relics.");
    if (run.finalSlain) return { run, events, outcome: "victory" };
    run.phase = "onward";
    run.clearedNote = "Onward.";
    return { run, events };
  }
  const offer = run.offer.find((o) => o.uid === offerUid);
  if (!offer) return { run: prev, events };
  for (const o of run.offer) {
    if (o.uid === offer.uid) continue;
    const rel = RELICS[o.defId];
    if (rel) run.treasureDiscard[rel.rarity].push(o.defId);
  }
  run.offer = [];
  run.pendingRelic = offer.defId;
  run.phase = "equip";
  log(run, `Claimed ${RELICS[offer.defId]?.name ?? "a relic"}. Who wears it?`);
  return { run, events: [{ sfx: "card" }] };
}

export function slotsFor(run: Run, hero: HeroState): { free: number; relics: string[] } {
  const relics = run.equipped[hero.id] ?? [];
  const used = relics.length + (hero.keepsakeId ? 1 : 0);
  return { free: Math.max(0, 3 - used), relics };
}

export function equipRelic(prev: Run, heroId: string, replaceId: string | null): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "equip" || !run.pendingRelic) return { run: prev, events };
  const hero = heroById(run, heroId);
  if (!hero) return { run: prev, events };
  const relicId = run.pendingRelic;
  const rel = RELICS[relicId];
  if (rel?.classes?.length && !rel.classes.includes(hero.classId)) {
    log(run, `${rel.name} will not answer ${hero.name}.`);
    return { run, events: [{ sfx: "ui", banner: "Not their art" }] };
  }
  const list = [...(run.equipped[hero.id] ?? [])];
  const slots = slotsFor(run, hero);
  if (slots.free <= 0) {
    if (!replaceId || !list.includes(replaceId)) return { run: prev, events };
    const idx = list.indexOf(replaceId);
    const dropped = list[idx]!;
    list[idx] = relicId;
    const old = RELICS[dropped];
    if (old) run.treasureDiscard[old.rarity].push(dropped);
    log(run, `${hero.name} replaces ${old?.name ?? "a relic"} with ${RELICS[relicId]?.name}.`);
  } else {
    list.push(relicId);
    log(run, `${hero.name} equips ${RELICS[relicId]?.name}.`);
  }
  run.equipped[hero.id] = list;
  recompute(hero, run, true);
  syncGrants(hero, run);
  grantXp(run, hero, 6, events);
  run.pendingRelic = null;
  events.push({ sfx: "unlock", banner: `${hero.name} takes ${RELICS[relicId]?.name}.` });
  if (run.finalSlain) return { run, events, outcome: "victory" };
  if (run.afterEquip === "shop") {
    run.afterEquip = null;
    run.phase = "shop";
    run.clearedNote = "The stall is still open.";
    return { run, events };
  }
  run.phase = "onward";
  run.clearedNote = "Packed. The next arch waits.";
  return { run, events };
}

function stockShop(run: Run): ShopEntry[] {
  const rnd = () => roll(run);
  const stock: ShopEntry[] = [];
  const caster = run.party.some((h) => h.maxMana > 0);
  const supplyIds = shuffle(
    Object.keys(SUPPLIES).filter((id) => id !== "sup-mana" && id !== "sup-revive"),
    rnd,
  ).slice(0, caster ? 1 : 2);
  supplyIds.push("sup-revive");
  if (caster) supplyIds.push("sup-mana");
  for (const id of supplyIds) {
    stock.push({ uid: nextUid(run, "k"), kind: "supply", defId: id, price: SUPPLY_COST[id] ?? 16 });
  }
  for (let i = 0; i < 2; i++) {
    const n = roll(run);
    const rarity: Rarity = i === 0 ? "common" : n < 0.08 ? "mythic" : n < 0.42 ? "rare" : "common";
    const id = takeRelic(run, rarity, true);
    if (!id) continue;
    stock.push({
      uid: nextUid(run, "k"),
      kind: "relic",
      defId: id,
      price: relicCost(RELICS[id]?.rarity ?? "common"),
    });
  }
  return stock;
}

function unsoldRelics(run: Run) {
  for (const item of run.shop) {
    if (item.kind !== "relic") continue;
    const rel = RELICS[item.defId];
    if (rel) run.treasureDiscard[rel.rarity].push(item.defId);
  }
  run.shop = [];
}

export function buySupply(prev: Run, entryUid: string): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "shop") return { run: prev, events };
  const item = run.shop.find((entry) => entry.uid === entryUid && entry.kind === "supply");
  if (!item) return { run: prev, events };
  const def = SUPPLIES[item.defId];
  if (!def) return { run: prev, events };
  if (run.supplies.length >= POUCH_MAX) {
    log(run, "The pouch is full.");
    return { run, events: [{ sfx: "ui" }] };
  }
  if (run.gold < item.price) {
    log(run, `Not enough gold for ${def.name}.`);
    return { run, events: [{ sfx: "ui" }] };
  }
  run.gold -= item.price;
  run.supplies.push({ uid: nextUid(run, "s"), defId: item.defId });
  run.shop = run.shop.filter((entry) => entry.uid !== item.uid);
  log(run, `Bought ${def.name} for ${item.price} gold. ${run.gold} left.`);
  return { run, events: [{ sfx: "card", banner: `${def.name} — ${item.price} gold` }] };
}

export function buyRelic(prev: Run, entryUid: string): StepResult {
  const run = clone(prev);
  const events: GameEvent[] = [];
  if (run.phase !== "shop") return { run: prev, events };
  const item = run.shop.find((entry) => entry.uid === entryUid && entry.kind === "relic");
  if (!item) return { run: prev, events };
  const rel = RELICS[item.defId];
  if (!rel) return { run: prev, events };
  if (run.gold < item.price) {
    log(run, `Not enough gold for ${rel.name}.`);
    return { run, events: [{ sfx: "ui" }] };
  }
  run.gold -= item.price;
  run.shop = run.shop.filter((entry) => entry.uid !== item.uid);
  run.pendingRelic = item.defId;
  run.afterEquip = "shop";
  run.phase = "equip";
  log(run, `Bought ${rel.name} for ${item.price} gold. Who wears it?`);
  return { run, events: [{ sfx: "card" }] };
}

export function leaveShop(prev: Run): StepResult {
  const run = clone(prev);
  if (run.phase !== "shop") return { run: prev, events: [] };
  unsoldRelics(run);
  run.phase = "onward";
  run.clearedNote = "The stall shutters.";
  log(run, run.clearedNote);
  return { run, events: [] };
}

export function discardSupply(prev: Run, supplyUid: string): StepResult {
  const run = clone(prev);
  if (run.phase !== "supply") return { run: prev, events: [] };
  const inst = run.supplies.find((s) => s.uid === supplyUid);
  if (!inst) return { run: prev, events: [] };
  run.supplies = run.supplies.filter((s) => s.uid !== supplyUid);
  run.supplyDiscard.push(inst.defId);
  log(run, `Left ${SUPPLIES[inst.defId]?.name ?? "a supply"} behind.`);
  return { run, events: [{ sfx: "ui" }] };
}

export function packSupplies(prev: Run): StepResult {
  const run = clone(prev);
  if (run.phase !== "supply") return { run: prev, events: [] };
  if (run.supplies.length > POUCH_MAX) return { run: prev, events: [] };
  run.phase = "onward";
  run.clearedNote = "Pouches cinched.";
  return { run, events: [] };
}

export function goDeeper(prev: Run): StepResult {
  const run = clone(prev);
  if (run.phase !== "onward") return { run: prev, events: [] };
  if (run.finalSlain) return { run, events: [], outcome: "victory" };
  stashMonsters(run);
  run.enemies = [];
  run.depth += 1;
  run.offer = [];
  run.pendingRelic = null;
  generateDoors(run);
  return { run, events: [{ sfx: "door" }] };
}

export function monsterDeckCount(run: Run): number {
  return run.weakDeck.length + run.standardDeck.length;
}

export function eliteDeckCount(run: Run): number {
  return run.eliteDeck.length;
}

export function supplyDeckCount(run: Run): number {
  return run.supplyDeck.length;
}

export function bossDeckCount(run: Run): number {
  return run.finalSlain ? 0 : 4 - run.seals;
}

export function syncRoster(roster: PersistedHero[], run: Run): PersistedHero[] {
  return roster.map((h) => {
    const p = run.party.find((x) => x.id === h.id);
    if (!p) return h;
    return { ...h, level: p.level, xp: p.xp };
  });
}

export function newlyUnlocked(roster: PersistedHero[], stats: { wins: number; doors?: string[]; slain?: string[] }): string[] {
  const doors = new Set(stats.doors ?? []);
  const slain = new Set(stats.slain ?? []);
  const ids: string[] = [];
  for (const h of roster) {
    if (h.unlocked) continue;
    const key = CLASSES[h.classId]?.unlock?.key;
    const ok =
      (key === "door-ambush" && doors.has("ambush")) ||
      (key === "door-curse" && doors.has("curse")) ||
      (key === "door-font" && doors.has("font")) ||
      (key === "boss-warden" && slain.has("warden")) ||
      (key === "boss-king" && (slain.has("king") || stats.wins > 0));
    if (ok) ids.push(h.id);
  }
  return ids;
}

export function cardNeeds(cardId: string): "enemy" | "ally" | "any-hero" | "none" {
  const card = CARDS[cardId] ?? SUPPLIES[cardId];
  if (!card) return "none";
  if (card.target === "any-hero") return "any-hero";
  if (card.target === "ally") return "ally";
  if (card.target === "enemy") return "enemy";
  if (cardNeedsTarget(card.target, card.effects)) return "enemy";
  return "none";
}

export function enemyIntent(enemy: EnemyState, round = 1): string {
  const atk = Math.max(1, enemy.atk - enemy.weaken) + Math.max(0, round - 20);
  if (enemy.skip) return "Skips";
  const cleave = enemy.alwaysCleave || (enemy.raging && enemy.rageCleave);
  const double = enemy.alwaysDouble || (enemy.raging && enemy.rageDouble);
  const tag = enemy.raging ? "Rage " : "Attack ";
  const n = cleave ? Math.max(1, Math.round(atk * 0.6)) : atk;
  let line = `${tag}${n}`;
  if (cleave) line += " all";
  if (double) line += " × 2";
  if (enemy.poisonOnHit > 0) line += ` · P${enemy.poisonOnHit}`;
  return line;
}

export function bossLabel(enemy: EnemyState): string {
  if (!enemy.boss) return enemy.tier;
  const forms = enemy.forms || 1;
  if (forms <= 1) return enemy.raging ? "Raging boss" : "Boss";
  const name = enemy.form > 1 && enemy.formName ? ` · ${enemy.formName}` : "";
  const rage = enemy.raging ? " · Raging" : "";
  return `Form ${enemy.form || 1}/${forms}${name}${rage}`;
}

export { CARDS, SUPPLIES, RELICS, CLASSES, POUCH_MAX };
