import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoster } from "./content.ts";
import { beginBattle, chooseDoor, endTurn, playCard, startRun, stepEnemies } from "./engine.ts";
import type { DoorState, Run } from "./types.ts";

function quietDoor(uid: string): DoorState {
  return {
    uid,
    kind: "quiet",
    title: "Hall",
    hint: "h",
    risk: "Low",
    lootLabel: "l",
    foes: "1",
    odds: { common: 70, rare: 30, mythic: 0 },
  };
}

function enterFight(classId: string, seed: number): Run {
  let run = startRun(defaultRoster(), [classId], seed);
  run.doors = [quietDoor("d1")];
  run = chooseDoor(run, "d1").run;
  assert.equal(run.phase, "prep");
  run = beginBattle(run).run;
  assert.equal(run.phase, "battle");
  assert.equal(run.enemies.length > 0, true);
  return run;
}

describe("gameplay fixes", () => {
  it("ends a dry turn and restores 1 mana next round", () => {
    let run = enterFight("necro", 2);
    const hero = run.party[0]!;
    assert.ok(hero.maxMana > 0);
    hero.mana = 0;
    run.hand = [{ uid: "raise", cardId: "n-raise" }];
    const passed = endTurn(run);
    run = passed.run;
    assert.equal(run.phase, "enemy");
    assert.equal(run.hand.length, 0);
    assert.equal(run.party[0]!.discard.includes("n-raise"), true);
    assert.equal(run.party[0]!.exhaust.includes("n-raise"), false);
    assert.equal(run.party[0]!.mana, 0);

    let guard = 0;
    while (run.phase === "enemy" && guard++ < 30) {
      const step = stepEnemies(run);
      run = step.run;
      if (step.outcome === "defeat") break;
    }
    assert.equal(run.phase, "prep");
    assert.equal(run.party[0]!.mana, 1);
    assert.equal(run.round, 2);
  });

  it("returns exhausted cards to the deck at the next fight", () => {
    let run = enterFight("druid", 3);
    const foe = run.enemies[0]!;
    foe.hp = 9999;
    foe.maxHp = 9999;
    run.hand = [
      { uid: "shed", cardId: "d-shed" },
      { uid: "bark", cardId: "d-bark" },
      { uid: "briar", cardId: "d-briar" },
    ];
    const played = playCard(run, "shed", null);
    run = played.run;
    assert.equal(run.party[0]!.exhaust.includes("d-bark"), true);
    assert.equal(run.party[0]!.exhaust.includes("d-briar"), true);
    assert.equal(run.party[0]!.exhaust.includes("d-shed"), false);

    run.phase = "doors";
    run.doors = [quietDoor("d2")];
    run = chooseDoor(run, "d2").run;
    const pile = [...run.party[0]!.deck, ...run.party[0]!.discard];
    assert.equal(run.party[0]!.exhaust.length, 0);
    assert.equal(pile.includes("d-bark"), true);
    assert.equal(pile.includes("d-briar"), true);
  });

  it("caps weaken at 8 and breaks stalemates after round 20", () => {
    let run = enterFight("druid", 4);
    const foeUid = run.enemies[0]!.uid;
    for (let i = 0; i < 5; i++) {
      run.phase = "battle";
      run.actorIndex = 0;
      run.playsLeft = 1;
      run.hand = [{ uid: `ent-${i}`, cardId: "d-entangle" }];
      run.enemies[0]!.hp = 9999;
      run = playCard(run, `ent-${i}`, foeUid).run;
    }
    assert.equal(run.enemies[0]!.weaken, 8);

    const lost = (round: number) => {
      const fight = enterFight("druid", 5);
      const hero = fight.party[0]!;
      hero.def = 0;
      hero.defBuff = 0;
      hero.block = 0;
      hero.hp = 80;
      hero.maxHp = 80;
      const foe = fight.enemies[0]!;
      foe.atk = 4;
      foe.baseAtk = 4;
      foe.weaken = 0;
      foe.pierce = 0;
      foe.bleed = 0;
      foe.poison = 0;
      foe.skip = false;
      foe.alwaysDouble = false;
      foe.alwaysCleave = false;
      foe.raging = false;
      foe.rageDouble = false;
      foe.rageCleave = false;
      fight.minions = [];
      fight.round = round;
      fight.phase = "enemy";
      fight.beat = "bleed";
      fight.strikeIndex = 0;
      fight.strikeHitsLeft = 0;
      fight.tauntHeroId = null;
      const before = hero.hp;
      const step = stepEnemies(fight);
      return before - step.run.party[0]!.hp;
    };
    assert.equal(lost(20), 4);
    assert.equal(lost(21), 5);
  });
});
