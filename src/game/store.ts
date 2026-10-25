import { create } from "zustand";
import { CLASSES } from "./content";
import { playSfx, setMuted } from "./audio";
import {
  acknowledgeCurse,
  beginBattle,
  brace,
  buyRelic,
  buySupply,
  chooseDoor,
  chooseRelic,
  discardSupply,
  equipRelic,
  goDeeper,
  leaveShop,
  newlyUnlocked,
  packSupplies,
  playCard,
  startRun,
  stepEnemies,
  syncRoster,
  useSupply as applySupplyAction,
  endTurn as passTurn,
} from "./engine";
import { emptySave, loadSave, writeSave } from "./save";
import type { Floater, PersistedHero, Results, Run, SaveBlob, Settings, Stats, StepResult } from "./types";

interface Banner {
  id: number;
  text: string;
}

interface GameStore {
  hydrated: boolean;
  roster: PersistedHero[];
  stats: Stats;
  settings: Settings;
  partyIds: string[];
  run: Run | null;
  results: Results | null;
  floaters: Floater[];
  banner: Banner | null;
  shakeId: number;
  seq: number;
  rules: boolean;
  sheet: string | null;
  abandonAsk: boolean;
  hydrate: () => void;
  toggleMute: () => void;
  toggleHero: (id: string) => void;
  openRules: (open: boolean) => void;
  openSheet: (id: string | null) => void;
  askAbandon: (open: boolean) => void;
  start: () => void;
  abandon: () => void;
  resetGuild: () => void;
  chooseDoor: (id: string) => void;
  brace: (id: string) => void;
  applySupply: (id: string, target: string | null) => void;
  beginBattle: () => void;
  playCard: (id: string, target: string | null) => void;
  endTurn: () => void;
  step: () => void;
  acknowledgeCurse: () => void;
  chooseRelic: (id: string | "none") => void;
  equipRelic: (heroId: string, replaceId: string | null) => void;
  discardSupply: (id: string) => void;
  packSupplies: () => void;
  buySupply: (id: string) => void;
  buyRelic: (id: string) => void;
  leaveShop: () => void;
  goDeeper: () => void;
  pickKeepsake: (heroId: string, relicId: string) => void;
  returnToCamp: () => void;
  dismissBanner: () => void;
}

function persist(s: GameStore) {
  const blob: SaveBlob = {
    version: 1,
    roster: s.roster,
    stats: s.stats,
    settings: s.settings,
    partyIds: s.partyIds,
    locker: [],
    loadout: {},
    run: s.run,
    results: s.results,
  };
  writeSave(blob);
}

function outcomeResults(run: Run, victory: boolean, unlocked: string[]): Results {
  return {
    victory,
    unlocked,
    bound: false,
    choice: null,
    rows: run.party.map((h) => ({
      id: h.id,
      name: h.name,
      classId: h.classId,
      xp: run.xpGained[h.id] ?? 0,
      from: run.levelStart[h.id] ?? h.level,
      to: h.level,
      relics: [...(run.equipped[h.id] ?? [])],
    })),
  };
}

export const useGame = create<GameStore>((set, get) => {
  function commit(result: StepResult) {
    const cur = get();
    let roster = syncRoster(cur.roster, result.run);
    const stats = { ...cur.stats };
    if (!Array.isArray(stats.doors)) stats.doors = [];
    if (!Array.isArray(stats.slain)) stats.slain = [];
    let seq = cur.seq;
    let shakeId = cur.shakeId;
    const floaters = [...cur.floaters];
    let bannerText: string | null = null;
    for (const e of result.events) {
      if (e.floater) {
        seq += 1;
        floaters.push({ id: seq, key: e.floater.key, text: e.floater.text, kind: e.floater.kind });
      }
      if (e.banner) bannerText = e.banner;
      if (e.shake) {
        seq += 1;
        shakeId = seq;
      }
      if (e.sfx && !cur.settings.mute) playSfx(e.sfx);
      if (e.bossDead) {
        stats.bosses += 1;
        if (e.bossDead.lowHp) stats.lowHpBoss = true;
        if (!stats.slain.includes(e.bossDead.id)) stats.slain = [...stats.slain, e.bossDead.id];
      }
      if (e.doorDone && !stats.doors.includes(e.doorDone)) stats.doors = [...stats.doors, e.doorDone];
    }
    const unlockedNow = newlyUnlocked(roster, stats);
    if (unlockedNow.length) {
      roster = roster.map((h) => (unlockedNow.includes(h.id) ? { ...h, unlocked: true } : h));
    }
    let unlocked = [...unlockedNow];
    let results = cur.results;
    let run: Run | null = result.run;
    if (result.outcome) {
      if (result.outcome === "victory") {
        stats.wins += 1;
        if (result.run.party.length >= 4) stats.fullPartyWin = true;
        if (!cur.settings.mute) playSfx("win");
      } else if (!cur.settings.mute) playSfx("lose");
      const more = newlyUnlocked(roster, stats);
      if (more.length) {
        roster = roster.map((h) => (more.includes(h.id) ? { ...h, unlocked: true } : h));
        unlocked = [...unlocked, ...more];
      }
      if (unlocked.length) {
        bannerText = `${unlocked.map((id) => CLASSES[id]?.heroName ?? "A hero").join(", ")} joins the guild.`;
        if (!cur.settings.mute) playSfx("unlock");
      }
      results = outcomeResults(result.run, result.outcome === "victory", unlocked);
      run = null;
    } else if (unlocked.length) {
      bannerText = `${unlocked.map((id) => CLASSES[id]?.heroName ?? "A hero").join(", ")} joins the guild.`;
      if (!cur.settings.mute) playSfx("unlock");
    }
    if (bannerText) {
      seq += 1;
    }
    const banner = bannerText ? { id: seq, text: bannerText } : cur.banner;
    set({ roster, stats, run, results, floaters: floaters.slice(-10), banner, shakeId, seq });
    persist(get());
  }

  return {
    hydrated: false,
    roster: emptySave().roster,
    stats: emptySave().stats,
    settings: { mute: false },
    partyIds: ["knight"],
    run: null,
    results: null,
    floaters: [],
    banner: null,
    shakeId: 0,
    seq: 1,
    rules: false,
    sheet: null,
    abandonAsk: false,
    hydrate: () => {
      const saved = loadSave();
      const ids = newlyUnlocked(saved.roster, saved.stats);
      const roster = ids.length
        ? saved.roster.map((h) => (ids.includes(h.id) ? { ...h, unlocked: true } : h))
        : saved.roster;
      setMuted(saved.settings.mute);
      set({
        hydrated: true,
        roster,
        stats: saved.stats,
        settings: saved.settings,
        partyIds: saved.partyIds,
        run: saved.results ? null : saved.run,
        results: saved.results,
        floaters: [],
        banner: null,
      });
      if (ids.length) persist(get());
    },
    toggleMute: () => {
      const settings = { mute: !get().settings.mute };
      setMuted(settings.mute);
      set({ settings });
      persist(get());
    },
    toggleHero: (id) => {
      const { roster, partyIds, run } = get();
      if (run) return;
      const hero = roster.find((h) => h.id === id);
      const open = Boolean(hero && (hero.unlocked || !CLASSES[id]?.unlock));
      if (!open || !hero) return;
      const nextRoster = hero.unlocked ? roster : roster.map((h) => (h.id === id ? { ...h, unlocked: true } : h));
      const next = partyIds.includes(id) ? partyIds.filter((x) => x !== id) : partyIds.length >= 4 ? partyIds : [...partyIds, id];
      set({ roster: nextRoster, partyIds: next });
      persist(get());
    },
    openRules: (open) => set({ rules: open }),
    openSheet: (id) => set({ sheet: id }),
    askAbandon: (open) => set({ abandonAsk: open }),
    start: () => {
      const s = get();
      if (s.run || s.partyIds.length === 0) return;
      const run = startRun(s.roster, s.partyIds);
      const stats = { ...s.stats, runs: s.stats.runs + 1 };
      set({ run, results: null, stats, floaters: [], banner: null, abandonAsk: false });
      if (!s.settings.mute) playSfx("door");
      persist(get());
    },
    abandon: () => {
      set({ run: null, abandonAsk: false, floaters: [], banner: null });
      persist(get());
    },
    resetGuild: () => {
      const mute = get().settings.mute;
      const blank = emptySave();
      blank.settings.mute = mute;
      setMuted(mute);
      set({
        roster: blank.roster,
        stats: blank.stats,
        settings: blank.settings,
        partyIds: blank.partyIds,
        run: null,
        results: null,
        floaters: [],
        banner: null,
        rules: false,
        sheet: null,
      });
      persist(get());
    },
    chooseDoor: (id) => {
      const run = get().run;
      if (!run) return;
      commit(chooseDoor(run, id));
    },
    brace: (id) => {
      const run = get().run;
      if (!run) return;
      commit(brace(run, id));
    },
    applySupply: (id, target) => {
      const run = get().run;
      if (!run) return;
      commit(applySupplyAction(run, id, target));
    },
    beginBattle: () => {
      const run = get().run;
      if (!run) return;
      commit(beginBattle(run));
    },
    playCard: (id, target) => {
      const run = get().run;
      if (!run) return;
      commit(playCard(run, id, target));
    },
    endTurn: () => {
      const run = get().run;
      if (!run) return;
      commit(passTurn(run));
    },
    step: () => {
      const run = get().run;
      if (!run || run.phase !== "enemy") return;
      commit(stepEnemies(run));
    },
    acknowledgeCurse: () => {
      const run = get().run;
      if (!run) return;
      commit(acknowledgeCurse(run));
    },
    chooseRelic: (id) => {
      const run = get().run;
      if (!run) return;
      commit(chooseRelic(run, id));
    },
    equipRelic: (heroId, replaceId) => {
      const run = get().run;
      if (!run) return;
      commit(equipRelic(run, heroId, replaceId));
    },
    discardSupply: (id) => {
      const run = get().run;
      if (!run) return;
      commit(discardSupply(run, id));
    },
    packSupplies: () => {
      const run = get().run;
      if (!run) return;
      commit(packSupplies(run));
    },
    buySupply: (id) => {
      const run = get().run;
      if (!run) return;
      commit(buySupply(run, id));
    },
    buyRelic: (id) => {
      const run = get().run;
      if (!run) return;
      commit(buyRelic(run, id));
    },
    leaveShop: () => {
      const run = get().run;
      if (!run) return;
      commit(leaveShop(run));
    },
    goDeeper: () => {
      const run = get().run;
      if (!run) return;
      commit(goDeeper(run));
    },
    pickKeepsake: (heroId, relicId) => {
      const results = get().results;
      if (!results?.victory) return;
      const row = results.rows.find((r) => r.id === heroId);
      if (!row?.relics.includes(relicId)) return;
      const same = results.choice?.heroId === heroId && results.choice.relicId === relicId;
      set({ results: { ...results, choice: same ? null : { heroId, relicId } } });
      persist(get());
    },
    returnToCamp: () => {
      const { results, roster } = get();
      let next = roster;
      if (results?.choice) {
        const { heroId, relicId } = results.choice;
        next = roster.map((h) => (h.id === heroId ? { ...h, keepsakeId: relicId } : h));
      }
      set({ roster: next, results: null, run: null, floaters: [], banner: null });
      persist(get());
    },
    dismissBanner: () => set({ banner: null }),
  };
});
